import React, { useRef, useEffect } from "react";
import CONFIG, { DefaultCornerToColorMap } from "../config";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { rollDice, startFourPlayerGame, moveToken, startOnePlayerTestGame} from "../redux/actions/ludoActions";
import type { Corner, CornerToPlayerMapType, TokenPositionMap, TokenId } from "../types/globalTypes";

interface drawTokenStandsParams {
    canvasCtx: CanvasRenderingContext2D | null;
    x: number;
    y: number;
    color: string;
    cellSize: number;
}

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {board, tokenMap, currentTurn, diceValue, cornerToPlayerMap, tokensPositions} = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // Get parent size
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      // Handle high-DPI (e.g., Retina displays)
      const dpr = window.devicePixelRatio || 1;

      // Set canvas internal size to match display size * dpr
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale context so drawing matches screen pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);

      // Set canvas visible size via CSS (matches parent)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drawStaticLudoBoard(ctx, width, height);
    //   drawToken3D(ctx, x + cellSize + cellSize * 0.5 + cellSize / 2, y + cellSize + cellSize * 0.5 + cellSize / 2, cellSize * 0.4, color);
    };

      resizeCanvas();
      dispatch(startOnePlayerTestGame());
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw the static board
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    drawStaticLudoBoard(ctx, width, height);
    const cellSize = getBoardSize(width, height) / 15; 
    
    // Draw tokens based on the board state
    Object.entries(board).forEach(([position, tokenIds]) => {
      if (tokenIds && tokenIds.length > 0) {
        tokenIds.forEach((tokenId) => {
        //   console.log("Drawing token:", tokenId, "at position:", position, tokenMap[tokenId]);
          const tokenColor = tokenMap[tokenId]?.color;
          const cellCoords = cellCoordinates[position];
          if (cellCoords) {
            const { row, col } = cellCoords;
            const pixelCoords = getPixelCoords(CONFIG.MIN_X, CONFIG.MIN_Y, row, col, cellSize);
            let xCord = pixelCoords.x;
            let yCord = pixelCoords.y;
            if (position.split("-")?.[1] === "tokenStand") {
              xCord += cellSize * 0.5;
              yCord += cellSize * 0.5;
            }
            drawToken3D(ctx, xCord, yCord, cellSize * 0.4, tokenColor || "red");
          }
        });
      }
    });
    const {row, col} = cellCoordinates["victorySquare"];
    const centrePixelCoords = getPixelCoords(CONFIG.MIN_X, CONFIG.MIN_Y, row, col, cellSize);
    drawDicePanel(ctx, centrePixelCoords.x, centrePixelCoords.y, cellSize * 2, diceValue, currentTurn);
  }, [currentTurn, diceValue]);

  // --- Effect 5: Handle Click/Touch on Dice Panel ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Define handleDiceInteraction inside this useEffect to capture dispatch and current state values
    const handleDiceInteraction = (event: MouseEvent | TouchEvent) => {
        event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)

        // const rect = canvas.getBoundingClientRect();
        let clientX: number, clientY: number;

        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else { // TouchEvent
            if (event.touches.length === 0) return;
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        // // Adjust for canvas's CSS size and DPI scaling
        // const clickX = (clientX - rect.left) * (canvas.width / rect.width);
        // const clickY = (clientY - rect.top) * (canvas.height / rect.height);

        // Calculate dice panel bounds based on current canvas dimensions
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        const currentCellSize = getBoardSize(width, height) / 15; 

        const victorySquareCoords = cellCoordinates["victorySquare"];

        if (victorySquareCoords) {
            const { row, col } = victorySquareCoords;
            const pixelCoords = getPixelCoords(CONFIG.MIN_X, CONFIG.MIN_Y, row, col, currentCellSize);
            const panelSize = currentCellSize; 

            const panelLeft = pixelCoords.x - panelSize / 2;
            const panelRight = pixelCoords.x + panelSize / 2;
            const panelTop = pixelCoords.y - panelSize / 2;
            const panelBottom = pixelCoords.y + panelSize / 2;
            
            if (panelLeft <= clientX && clientX <= panelRight &&
                panelTop <= clientY && clientY <= panelBottom) {
                // console.log("Dice panel clicked/touched! Dispatching ROLL_DICE.");
                dispatch(rollDice());
            }
        }
    };

    // Attach event listeners
    canvas.addEventListener('mousedown', handleDiceInteraction);
    canvas.addEventListener('touchstart', handleDiceInteraction);

    // Cleanup function to remove event listeners
    return () => {
        canvas.removeEventListener('mousedown', handleDiceInteraction);
        canvas.removeEventListener('touchstart', handleDiceInteraction);
    };
  }, [dispatch, currentTurn]); // Dependencies: dispatch (stable), cellSize (if it can truly change dynamically)

  // MakeMove
  useEffect(() => {
    const tokenId = getRandomToken(cornerToPlayerMap, currentTurn, tokensPositions, diceValue || 0);
    if (tokenId && diceValue) {
      dispatch(moveToken(tokenId));
    }
  }, [diceValue]);

  return <canvas ref={canvasRef} width={400} height={200} />;
};

export default CanvasBoard;

const getRandomToken = (cornerToPlayerMap: CornerToPlayerMapType, currentTurn: Corner | null, tokenPositionMap: TokenPositionMap, diceValue: number): TokenId | null => {
    if (!currentTurn || !cornerToPlayerMap[currentTurn]) {
        return null; 
    }
    const player = cornerToPlayerMap[currentTurn];
    const tokenIds = player.tokenIds.filter(tokenId => tokenPositionMap[tokenId] !== "victorySquare");
    const openTokenIds = tokenIds.filter(tokenId => !tokenPositionMap[tokenId].includes("tokenStand"));
    if (tokenIds.length === 0) {
        return null; 
    }
    if (openTokenIds.length > 0 && diceValue !== 6) {
        // If there are open tokens, choose one randomly
        const randomOpenTokenIndex = Math.floor(Math.random() * openTokenIds.length);
        return openTokenIds[randomOpenTokenIndex];
    }
    const randomTokenIndex = Math.floor(Math.random() * tokenIds.length);
    return player?.tokenIds[randomTokenIndex]; 
}

const cellCoordinates: { [key: string]: { row: number; col: number } } = {
    // Main Path (52 squares, starting from Green's first square outside home)
    // Path starts at (13,6) (Green's first square on main track on bottumLeft corner) and goes clockwise
    "1": { row: 13, col: 6 }, // Green's start square (first square after leaving home)
    "2": { row: 12, col: 6 },
    "3": { row: 11, col: 6 },
    "4": { row: 10, col: 6 },
    "5": { row: 9, col: 6 },
    //turning left
    "6": { row: 8, col: 5 }, 
    "7": { row: 8, col: 4 },
    "8": { row: 8, col: 3 },
    "9": { row: 8, col: 2 },
    "10": { row: 8, col: 1 },
    "11": { row: 8, col: 0 },
    // turn right
    "12": { row: 7, col: 0 },
    "13": { row: 6, col: 0 }, // Corner
    // turn right
    "14": { row: 6, col: 1 },
    "15": { row: 6, col: 2 }, // Corner
    "16": { row: 6, col: 3 },
    "17": { row: 6, col: 4 },
    "18": { row: 6, col: 5 },
    // turn left
    "19": { row: 5, col: 6 },
    "20": { row: 4, col: 6 },
    "21": { row: 3, col: 6 }, // Green's start square
    "22": { row: 2, col: 6 },
    "23": { row: 1, col: 6 },
    "24": { row: 0, col: 6 },
    // turn right
    "25": { row: 0, col: 7 },
    "26": { row: 0, col: 8 }, // Corner
    // turn right
    "27": { row: 1, col: 8 },
    "28": { row: 2, col: 8 }, // Corner
    "29": { row: 3, col: 8 },
    "30": { row: 4, col: 8 },
    "31": { row: 5, col: 8 },
    // turn left
    "32": { row: 6, col: 9 },
    "33": { row: 6, col: 10 }, // Blue's start square
    "34": { row: 6, col: 11 },
    "35": { row: 6, col: 12 },
    "36": { row: 6, col: 13 },
    "37": { row: 6, col: 14 },
    // turn right
    "38": { row: 7, col: 14 },
    "39": { row: 8, col: 14 }, // Corner
    // turn right
    "40": { row: 8, col: 13 },
    "41": { row: 8, col: 12 }, // Corner
    "42": { row: 8, col: 11 },
    "43": { row: 8, col: 10 },
    "44": { row: 8, col: 9 },
    // turn left
    "45": { row: 9, col: 8 },
    "46": { row: 10, col: 8 }, // Yellow's start square
    "47": { row: 11, col: 8 },
    "48": { row: 12, col: 8 },
    "49": { row: 13, col: 8 },
    "50": { row: 14, col: 8 },
    // turn right
    "51": { row: 14, col: 7 },
    "52": { row: 14, col: 6 }, // Before turning left to Red's home path

    // Victory Paths (leading to center) - adjusted for clockwise path
    "bottumLeft-victory-52": { row: 13, col: 7 }, // Green victory path (from 52 towards center)
    "bottumLeft-victory-53": { row: 12, col: 7 },
    "bottumLeft-victory-54": { row: 11, col: 7 },
    "bottumLeft-victory-55": { row: 10, col: 7 },
    "bottumLeft-victory-56": { row: 9, col: 7 },

    "topLeft-victory-13": { row: 7, col: 1 }, // Red victory path (from 26 towards center)
    "topLeft-victory-14": { row: 7, col: 2 },
    "topLeft-victory-15": { row: 7, col: 3 },
    "topLeft-victory-16": { row: 7, col: 4 },
    "topLeft-victory-17": { row: 7, col: 5 },

    "topRight-victory-26": { row: 1, col: 7 }, // Blue victory path (from 39 towards center)
    "topRight-victory-27": { row: 2, col: 7 },
    "topRight-victory-28": { row: 3, col: 7 },
    "topRight-victory-29": { row: 4, col: 7 },
    "topRight-victory-30": { row: 5, col: 7 },

    "bottumRight-victory-39": { row: 7, col: 13 }, // Yellow victory path (from 52 towards center)
    "bottumRight-victory-40": { row: 7, col: 12 },
    "bottumRight-victory-41": { row: 7, col: 11 },
    "bottumRight-victory-42": { row: 7, col: 10 },
    "bottumRight-victory-43": { row: 7, col: 9 },

    // Token Stands (initial positions within home areas)
    "bottumLeft-tokenStand-1": { row: 10, col: 1 }, // Green
    "bottumLeft-tokenStand-2": { row: 10, col: 3 },
    "bottumLeft-tokenStand-3": { row: 12, col: 1 },
    "bottumLeft-tokenStand-4": { row: 12, col: 3 },

    "topLeft-tokenStand-1": { row: 1, col: 1 }, // Red
    "topLeft-tokenStand-2": { row: 1, col: 3 },
    "topLeft-tokenStand-3": { row: 3, col: 1 },
    "topLeft-tokenStand-4": { row: 3, col: 3 },

    "topRight-tokenStand-1": { row: 1, col: 10 }, // Blue
    "topRight-tokenStand-2": { row: 1, col: 12 },
    "topRight-tokenStand-3": { row: 3, col: 10 },
    "topRight-tokenStand-4": { row: 3, col: 12 },

    "bottumRight-tokenStand-1": { row: 10, col: 10 }, // Yellow
    "bottumRight-tokenStand-2": { row: 10, col: 12 },
    "bottumRight-tokenStand-3": { row: 12, col: 10 },
    "bottumRight-tokenStand-4": { row: 12, col: 12 },

    // Center victory square
    "victorySquare": { row: 7, col: 7 },
};

// --- Helper to get pixel coordinates from cell coordinates ---
const getPixelCoords = (xMargin: number, yMargin: number, row: number, col: number, cellSize: number) => {
    return {
            x: xMargin + col * cellSize + cellSize / 2, // Centering the token in the cell
            y: yMargin + row * cellSize + cellSize / 2 // Centering the token in the cell,
    };
};


const getBoardSize = (width: number, height: number): number => {
    // const minX = CONFIG.MIN_X;
    // const minY = CONFIG.MIN_Y;
    const boardSize = Math.min(width, height) * 0.9; // 90% of the smaller dimension
    return boardSize; // 15 cells in each direction
}

const drawStaticLudoBoard = (ctx: CanvasRenderingContext2D | null, width: number, height: number) => {
      if (!ctx) return 0;
      const minX = CONFIG.MIN_X;
      const minY = CONFIG.MIN_Y;
      const boardSize = getBoardSize(width, height);
      const cellSize = boardSize / 15;;
      const maxX = minX + boardSize;
      const maxY = minY + boardSize;
      const homeSize = cellSize * 6;
      const homeInside = homeSize - cellSize * 2
      const victoryPathSize = cellSize * 5;
      const stopColor = CONFIG.STOP_COLOR; // grey
      const RED = CONFIG.RED_HEXCODE;
      const YELLOW = CONFIG.YELLOW_HEXCODE;
      const GREEN = CONFIG.GREEN_HEXCODE;
      const BLUE = CONFIG.BLUE_HEXCODE;
      const BorderColor = CONFIG.BORDER_COLOR; // grey

      // Redraw
      ctx.fillStyle = "white";
      ctx.fillRect(minX, minY, boardSize, boardSize);
      drawParallelLinesInRect(ctx, minX, minY + homeSize, boardSize, cellSize, cellSize, "vertical", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX, minY + homeSize + cellSize * 2, boardSize, cellSize, cellSize, "vertical", BorderColor, 0.5);

      drawParallelLinesInRect(ctx, minX + homeSize, minY, cellSize, boardSize, cellSize, "horizontal", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + homeSize + cellSize * 2, minY, cellSize, boardSize, cellSize, "horizontal", BorderColor, 0.5);
      
      drawParallelLinesInRect(ctx, minX, minY + homeSize, cellSize, cellSize * 3, cellSize, "horizontal", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + boardSize - cellSize, minY + homeSize, cellSize, cellSize * 3, cellSize, "horizontal", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + homeSize, minY, cellSize * 3, cellSize, cellSize, "vertical", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + homeSize, minY + boardSize - cellSize, cellSize * 3, cellSize, cellSize, "vertical", BorderColor, 0.5);

      // red
      ctx.fillStyle = RED; // red
      ctx.fillRect(minX, minY, homeSize, homeSize);
      ctx.fillRect(minX + cellSize, minY + homeSize + cellSize , victoryPathSize, cellSize); // victoryPath
      drawStop(ctx, minX + cellSize, minY + homeSize, cellSize, BorderColor, RED); // homeStop
      ctx.fillStyle = stopColor;
    //   ctx.fillRect(minX + cellSize + cellSize, minY + homeSize + cellSize * 2, cellSize, cellSize); // Stop
      drawStop(ctx, minX + cellSize + cellSize, minY + homeSize + cellSize * 2, cellSize);
    //   drawStarInSquare(ctx, minX + cellSize + cellSize, minY + homeSize + cellSize * 2, cellSize);
      ctx.fillStyle = CONFIG.BACKGROUND_COLOR; // white
      ctx.fillRect(minX + cellSize, minY + cellSize, homeInside, homeInside);
      drawTokenStands({canvasCtx: ctx, x: minX, y: minY, color: RED, cellSize: cellSize});
      // yellow
      ctx.fillStyle = YELLOW; // yellow
      ctx.fillRect(maxX - homeSize, maxY - homeSize, homeSize, homeSize);
      ctx.fillRect(maxX - homeSize, maxY - homeSize - cellSize * 2, victoryPathSize, cellSize); // victoryPath
      drawStop(ctx, maxX - cellSize * 2, maxY - homeSize - cellSize, cellSize, BorderColor, YELLOW); // homeStop
      ctx.fillStyle = stopColor;
      ctx.fillRect(maxX - cellSize * 3, maxY - homeSize - cellSize*3, cellSize, cellSize); // Stop
      drawStarInSquare(ctx, maxX - cellSize * 3, maxY - homeSize - cellSize*3, cellSize);
      ctx.fillStyle = CONFIG.BACKGROUND_COLOR; // white
      ctx.fillRect(maxX - homeSize + cellSize, maxY - homeSize + cellSize, homeInside, homeInside);
      drawTokenStands({canvasCtx: ctx, x: maxX - homeSize, y: maxY - homeSize, color: YELLOW, cellSize: cellSize});
      // blue
      ctx.fillStyle = BLUE; // blue
      ctx.fillRect(maxX - homeSize, minY, homeSize, homeSize);
      ctx.fillRect(maxX - homeSize - cellSize * 2, minY + cellSize, cellSize, victoryPathSize);
      drawStop(ctx, maxX - homeSize - cellSize, minY + cellSize, cellSize, BorderColor, BLUE); // homeStop
      ctx.fillStyle = stopColor;
      ctx.fillRect(maxX - homeSize - cellSize*3, minY + cellSize*2, cellSize, cellSize); // Stop
      drawStarInSquare(ctx, maxX - homeSize - cellSize*3, minY + cellSize*2, cellSize);
      ctx.fillStyle = CONFIG.BACKGROUND_COLOR; // white
      ctx.fillRect(maxX - homeSize + cellSize, minY + cellSize, homeInside, homeInside);
      drawTokenStands({canvasCtx: ctx, x: maxX - homeSize, y: minY, color: BLUE, cellSize: cellSize});
      // green
      ctx.fillStyle = GREEN; // green
      ctx.fillRect(minX, maxY - homeSize, homeSize, homeSize);
      ctx.fillRect(minX + homeSize + cellSize, maxY - homeSize, cellSize, victoryPathSize);
      drawStop(ctx, minX + homeSize, maxY - cellSize * 2, cellSize, BorderColor, GREEN); // homeStop
      ctx.fillStyle = stopColor;
      ctx.fillRect(minX + homeSize + cellSize * 2, maxY - cellSize * 3, cellSize, cellSize); // Stop
      drawStarInSquare(ctx, minX + homeSize + cellSize * 2, maxY - cellSize * 3, cellSize);
      ctx.fillStyle = CONFIG.BACKGROUND_COLOR; // white
      ctx.fillRect(minX + cellSize, maxY - homeSize + cellSize, homeInside, homeInside);
      drawTokenStands({canvasCtx: ctx, x: minX, y: maxY - homeSize, color: GREEN, cellSize: cellSize});

      drawParallelLinesInRect(ctx, minX, minY + homeSize + cellSize, boardSize, cellSize, cellSize, "vertical", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + homeSize + cellSize, minY, cellSize, boardSize, cellSize, "horizontal", BorderColor, 0.5);

      ctx.fillStyle = "#bdc3c7"; // grey
      const victorySquare = cellSize * 3;
      ctx.fillRect(minX + homeSize, minY + homeSize, victorySquare, victorySquare);
      drawVictoryHome(ctx, minX + homeSize, minY + homeSize, victorySquare, [BLUE, YELLOW, GREEN, RED]);
}


function drawStarInSquare(
    ctx: CanvasRenderingContext2D,
    x: number,             // Top-left x of square
    y: number,             // Top-left y of square
    size: number           // Width and height of square
  ): void {
    // Draw the square
    ctx.strokeStyle = "#566573";
    ctx.lineWidth = 1;
    // ctx.strokeRect(x, y, size, size);
  
    // Star center and radii
    const cx = x + size / 2;
    const cy = y + size / 2;
    const outerRadius = size / 2.5;
    const innerRadius = outerRadius / 2.5;
    const spikes = 5;
  
    const step = Math.PI / spikes;
  
    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2; // Start from top
  
      const sx = cx + Math.cos(angle) * radius;
      const sy = cy + Math.sin(angle) * radius;
  
      if (i === 0) {
        ctx.moveTo(sx, sy);
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.closePath();
    // ctx.fillStyle = "#FFD700"; // gold
    // ctx.fill();
    ctx.stroke();
  }
  
  function drawParallelLinesInRect(
    ctx: CanvasRenderingContext2D,
    x: number,                 // Top-left x of rectangle
    y: number,                 // Top-left y of rectangle
    width: number,             // Width of rectangle
    height: number,            // Height of rectangle
    spacing: number,     // Space between lines to draw
    direction: "horizontal" | "vertical" = "horizontal", // Line direction
    lineColor: string = "black",
    lineWidth: number = 1
  ): void {
    // Draw outer rectangle
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(x, y, width, height);
  
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
  
    if (direction === "horizontal") {
      const numberOfLines = height / spacing;
      for (let i = 1; i <= numberOfLines; i++) {
        const yLine = y + i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, yLine);
        ctx.lineTo(x + width, yLine);
        ctx.stroke();
      }
    } else if (direction === "vertical") {
      const numberOfLines = width / spacing;
      for (let i = 1; i <= numberOfLines; i++) {
        const xLine = x + i * spacing;
        ctx.beginPath();
        ctx.moveTo(xLine, y);
        ctx.lineTo(xLine, y + height);
        ctx.stroke();
      }
    }
  }
  
  const drawVictoryHome = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, colors: string[]) => {

    // Corner points
    const topLeft: [number, number] = [x, y];
    const topRight: [number, number] = [x + size, y];
    const bottomRight: [number, number] = [x + size, y + size];
    const bottomLeft: [number, number] = [x, y + size];
    const center: [number, number] = [x + size / 2, y + size / 2];

    // Function to draw and fill a triangle
    function drawTriangle(
        p1: [number, number],
        p2: [number, number],
        p3: [number, number],
        color: string
    ): void {
        ctx.beginPath();
        ctx.moveTo(...p1);
        ctx.lineTo(...p2);
        ctx.lineTo(...p3);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Draw four triangles
    drawTriangle(topLeft, topRight, center, colors[0] || "grey");     // Top
    drawTriangle(topRight, bottomRight, center, colors[1] || "grey"); // Right
    drawTriangle(bottomRight, bottomLeft, center, colors[2] || "grey"); // Bottom
    drawTriangle(bottomLeft, topLeft, center, colors[3] || "grey");   // Left
}

const drawStop = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, borderColor: string = "#bdc3c7", bgColor: string = "#bdc3c7") => {
    ctx.fillStyle = bgColor; // grey
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, size, size);
    drawStarInSquare(ctx, x, y, size);
}


const drawTokenStands = ({canvasCtx, x, y, color, cellSize}: drawTokenStandsParams) => {
    if (canvasCtx == null) return;
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(x + cellSize + cellSize * 0.5, y + cellSize + cellSize * 0.5, cellSize, cellSize);
    canvasCtx.fillRect(x + cellSize + cellSize * 0.5, y + cellSize * 3 + cellSize * 0.5, cellSize, cellSize);
    canvasCtx.fillRect(x + cellSize*3 + cellSize * 0.5, y + cellSize * 3 + cellSize * 0.5, cellSize, cellSize);
    canvasCtx.fillRect(x + cellSize*3 + cellSize * 0.5, y + cellSize + cellSize * 0.5, cellSize, cellSize);
  }

  // Token 3D drawing function
  const drawToken3D = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ) => {
    const outerRadius = radius;
    const ringWidth = radius * 0.25;
    const innerRadius = radius - ringWidth;
  
    // === Outer Circle with Bevel Gradient ===
    const gradient = ctx.createRadialGradient(x, y - radius * 0.2, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, "#f9f6f2");
    gradient.addColorStop(0.6, "#d9c29f");
    gradient.addColorStop(1, "#a38b6d");
  
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  
    // === Blue Ring ===
    ctx.beginPath();
    ctx.arc(x, y, outerRadius * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = color; // Strong blue
    ctx.fill();
  
    // === Inner White Circle ===
    ctx.beginPath();
    ctx.arc(x, y, outerRadius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  // Dice drawing function
  // Add this function somewhere below your CanvasBoard component
const drawDicePanel = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    panelSize: number, // This will be the size of the square panel
    diceValue: number | null,
    currentTurn: Corner | null // Assuming currentTurn is a string like "bottumLeft", "topLeft", etc.
  ) => {
    const halfPanelSize = panelSize / 2;
  
    if (!currentTurn) return;
    // Draw background panel
    ctx.fillStyle = DefaultCornerToColorMap[currentTurn]; // Dark blue-grey background
    ctx.fillRect(centerX - halfPanelSize, centerY - halfPanelSize, panelSize, panelSize);
  
    // Draw border
    ctx.strokeStyle = "#34495e"; // Slightly lighter border
    ctx.lineWidth = panelSize * 0.05; // Border thickness relative to panel size
    ctx.strokeRect(centerX - halfPanelSize, centerY - halfPanelSize, panelSize, panelSize);
  
    ctx.fillStyle = "white"; // Text color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    if (diceValue !== null) {
      // If diceValue is available, display the number
      ctx.font = `bold ${panelSize * 0.6}px Arial`; // Large, bold font
      ctx.fillText(String(diceValue), centerX, centerY + panelSize * 0.05); // Slight adjustment for vertical centering
    } else {
      // If diceValue is null (e.g., at game start), display "ROLL DICE"
      ctx.font = `bold ${panelSize * 0.25}px Arial`;
      ctx.fillText("ROLL", centerX, centerY - panelSize * 0.1);
      ctx.fillText("DICE", centerX, centerY + panelSize * 0.2);
    }
  };