import React, { useRef, useEffect } from "react";

interface drawTokenStandsParams {
    canvasCtx: CanvasRenderingContext2D | null;
    x: number;
    y: number;
    color: string;
    cellSize: number;
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

// // Optional: Draw the outer border and diagonals
// ctx.strokeStyle = "black";
// ctx.lineWidth = 2;

// // Rectangle
// ctx.strokeRect(x, y, size, size);

// // Diagonals
// ctx.beginPath();
// ctx.moveTo(x, y);
// ctx.lineTo(x + size, y + size);
// ctx.moveTo(x + size, y);
// ctx.lineTo(x, y + size);
// ctx.stroke();
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

const CanvasBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minX = 10;
  const minY = 10;

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
      
      const boardSize = Math.min(width, height) * 0.9;
      const cellSize = boardSize / 15;
      const maxX = minX + boardSize;
      const maxY = minY + boardSize;
      const homeSize = cellSize * 6;
      const homeInside = homeSize - cellSize * 2
      const victoryPathSize = cellSize * 5;
      const stopColor = "#bdc3c7";
      const RED = "#e74c3c";
      const YELLOW = "#f4d03f";
      const GREEN = "#2ecc71";
      const BLUE = "#3498db";
      const BorderColor = "#566573"; // grey

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
      ctx.fillStyle = "white";
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
      ctx.fillStyle = "white";
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
      ctx.fillStyle = "white";
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
      ctx.fillStyle = "white";
      ctx.fillRect(minX + cellSize, maxY - homeSize + cellSize, homeInside, homeInside);
      drawTokenStands({canvasCtx: ctx, x: minX, y: maxY - homeSize, color: GREEN, cellSize: cellSize});

      drawParallelLinesInRect(ctx, minX, minY + homeSize + cellSize, boardSize, cellSize, cellSize, "vertical", BorderColor, 0.5);
      drawParallelLinesInRect(ctx, minX + homeSize + cellSize, minY, cellSize, boardSize, cellSize, "horizontal", BorderColor, 0.5);

      ctx.fillStyle = "#bdc3c7"; // grey
      const victorySquare = cellSize * 3;
      ctx.fillRect(minX + homeSize, minY + homeSize, victorySquare, victorySquare);
      drawVictoryHome(ctx, minX + homeSize, minY + homeSize, victorySquare, [BLUE, YELLOW, GREEN, RED]);
    //   ctx.fillStyle = "black";
    //   ctx.font = "16px sans-serif";
    //   ctx.fillText("Responsive Canvas!", 20, 80);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);


  return <canvas ref={canvasRef} width={400} height={200} />;
};

export default CanvasBoard;


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