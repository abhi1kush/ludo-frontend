// import { Player } from '../types';
import {TokenIds, Corners, DefaultCornerToColorMap, CornerToHomeStopMap } from '../../config';
import type { GameState, BoardType, TokenPositionMap, Color, TokenId, Position, CornerToPlayerMapType, TokenMapType, Corner} from '../../types/globalTypes';
// import { PlayerColors } from '../../types/globalTypes';
import type { GameAction } from '../actions/ludoActions';
import {ROLL_DICE, MOVE_TOKEN, START_FOUR_PLAYER_GAME } from '../actions/ludoActions';

const initialFourBoard: BoardType = {
    "bottumLeft-tokenStand-1": ["bottumLeft-1"],
    "bottumLeft-tokenStand-2": ["bottumLeft-2"],
    "bottumLeft-tokenStand-3": ["bottumLeft-3"],
    "bottumLeft-tokenStand-4": ["bottumLeft-4",],
    "bottumRight-tokenStand-1": ["bottumRight-1"],
    "bottumRight-tokenStand-2": ["bottumRight-2"],
    "bottumRight-tokenStand-3": ["bottumRight-3"],
    "bottumRight-tokenStand-4": ["bottumRight-4"],
    "topRight-tokenStand-1": ["topRight-1"],
    "topRight-tokenStand-2": ["topRight-2"], 
    "topRight-tokenStand-3": ["topRight-3"], 
    "topRight-tokenStand-4": ["topRight-4"],
    "topLeft-tokenStand-1": ["topLeft-1"],
    "topLeft-tokenStand-2": ["topLeft-2"], 
    "topLeft-tokenStand-3": ["topLeft-3"], 
    "topLeft-tokenStand-4": ["topLeft-4"],
    "1": null, //green home stop
    "2": null,
    "3": null, 
    "4": null, 
    "5": null, 
    "6": null, 
    "7": null, 
    "8": null, 
    "9": null, 
    "10": null, 
    "11": null, 
    "12": null, 
    "13": null, 
    "14": null,
    "15": null, 
    "16": null, 
    "17": null, 
    "18": null, 
    "19": null, 
    "20": null, 
    "21": null, 
    "22": null, 
    "23": null, 
    "24": null, 
    "25": null, 
    "26": null, 
    "27": null,
    "28": null, 
    "29": null,
    "30": null,
    "31": null,
    "32": null,
    "33": null,
    "34": null,
    "35": null,
    "36": null,
    "37": null, 
    "38": null, 
    "39": null, 
    "40": null,
    "41": null, 
    "42": null, 
    "43": null, 
    "44": null, 
    "45": null, 
    "46": null, 
    "47": null, 
    "48": null, 
    "49": null, 
    "50": null, 
    "51": null, 
    "52": null, 
    "bottumLeft-victory-52": null,
    "bottumLeft-victory-53": null,
    "bottumLeft-victory-54": null,
    "bottumLeft-victory-55": null,
    "bottumLeft-victory-56": null,
    "bottumRight-victory-39": null, 
    "bottumRight-victory-40": null, 
    "bottumRight-victory-41": null, 
    "bottumRight-victory-42": null, 
    "bottumRight-victory-43": null,
    "topRight-victory-26": null, 
    "topRight-victory-27": null,
    "topRight-victory-28": null,
    "topRight-victory-29": null,
    "topRight-victory-30": null,
    "topLeft-victory-13": null,
    "topLeft-victory-14": null,
    "topLeft-victory-15": null,
    "topLeft-victory-16": null,
    "topLeft-victory-17": null,
    "victorySquare": null
}

const intialTokenPosMap: TokenPositionMap = {
    "bottumLeft-1" : "bottumLeft-tokenStand-1",
    "bottumLeft-2" : "bottumLeft-tokenStand-2",
    "bottumLeft-3" : "bottumLeft-tokenStand-3",
    "bottumLeft-4" : "bottumLeft-tokenStand-4",
    "topLeft-1": "topLeft-tokenStand-1",
    "topLeft-2": "topLeft-tokenStand-2",
    "topLeft-3": "topLeft-tokenStand-3",
    "topLeft-4": "topLeft-tokenStand-4",
    "topRight-1": "topRight-tokenStand-1",
    "topRight-2": "topRight-tokenStand-2",
    "topRight-3": "topRight-tokenStand-3",
    "topRight-4": "topRight-tokenStand-4",
    "bottumRight-1": "bottumRight-tokenStand-1",
    "bottumRight-2": "bottumRight-tokenStand-2",
    "bottumRight-3": "bottumRight-tokenStand-3",
    "bottumRight-4": "bottumRight-tokenStand-4",
};

const initialState: GameState = {
  tokensPositions: intialTokenPosMap,
  board: initialFourBoard,
  cornerToPlayerMap: {
    "bottumLeft": null,
    "bottumRight": null,
    "topRight": null,
    "topLeft": null,
  },
  corners: [    
    "bottumLeft",
    "bottumRight",
    "topRight",
    "topLeft"
  ],
  tokenMap: {
    "bottumLeft-1" : null,
    "bottumLeft-2" : null,
    "bottumLeft-3" : null,
    "bottumLeft-4" : null,
    "bottumRight-1": null,
    "bottumRight-2": null,
    "bottumRight-3": null,
    "bottumRight-4": null,
    "topRight-1": null,
    "topRight-2": null,
    "topRight-3": null,
    "topRight-4": null,
    "topLeft-1": null,
    "topLeft-2": null,
    "topLeft-3": null,
    "topLeft-4": null,
  },
  winners: [],
  currentTurn: null,
  diceValue: null,
};

interface MoveTokenPayload {
    tokenId: TokenId;
}

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case START_FOUR_PLAYER_GAME:
        return {
            ...state,
            corners: Corners,
            cornerToPlayerMap: {...state.cornerToPlayerMap,
                ...getDefaultPlayers(Corners)
            },
            tokenMap: {...state.tokenMap,
                ...getDefaultTokenMap()
            },
            currentTurn: Corners[0],
        };
    case ROLL_DICE:
      return {
        ...state,
        diceValue: rollDice(),
      };
    case MOVE_TOKEN: {
      if (state.diceValue == null) return state;
      const { tokenId }: MoveTokenPayload = action.payload;
      const tokenPosition: Position = state.tokensPositions[tokenId];
      const newPosition : Position | null = getNewPosition(tokenId, tokenPosition, state.diceValue, state);
      if (newPosition == null) return state;
      const toBeKilledTokenId = getToBeKilledToken(state.currentTurn, state.board[newPosition]);

      return {
        ...state,
        tokensPositions: {
          ...state.tokensPositions,
          [tokenId]: newPosition,                                          // 1. update token position in tokensPositions 
          ...(toBeKilledTokenId                                            // 2. move killed token to start position tokensPositions 
            ? { [toBeKilledTokenId]: getStartPosition(toBeKilledTokenId) } 
            : {}),
        },
        board: {
            ...state.board,
            ...(toBeKilledTokenId 
                ? { [newPosition]: state.board[newPosition]?.filter((tokId) => tokId !== toBeKilledTokenId), // 3. Remove to be killed token from its position in the board.
                    [getStartPosition(toBeKilledTokenId)]: [toBeKilledTokenId]                               // 4. Add toBeKilledTokenId to its start position in the board.
                } 
                : {}),                                                                           
            [tokenPosition]: state.board[tokenPosition]?.filter((tokId) => tokId !== tokenId),   // 5. remove current token from old position.
            [newPosition]: state.board[newPosition] == null ? [tokenId] : [...state.board[newPosition], tokenId], // 6. Add current token from new position. 
        },
        cornerToPlayerMap: {
            ...state.cornerToPlayerMap,
            ...(state.currentTurn 
                ? {[state.currentTurn]: {
                    ...state.cornerToPlayerMap[state.currentTurn],
                    isPlaying: hasWon(state.currentTurn, state),
                }}: {}),
        }
     }
    }
    default:
      return state;
  }
};

function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

function getStartPosition(tokenId: TokenId): Position {
    const tokenIdSplitted: string[] = tokenId.split("-");
    return `${tokenIdSplitted[0]}-tokenStand-${tokenIdSplitted[1]}` as Position;
}

function getNewPosition(tokenId: TokenId, currPosition: Position, diceValue: number, state: GameState): Position | null {
    if (state.currentTurn == null) return null; 
    const currentPlayer = state.cornerToPlayerMap[state.currentTurn];
    if (currentPlayer == null) return null;
    const splitPosition = currPosition.split("-"); 
    const token = state.tokenMap[tokenId];    
    if (token == null) return null; 
    const commonPathEndNum = parseInt(token.commonPathEnd);
    const victorySquareNum = commonPathEndNum + 6;
    if (splitPosition.length === 1) {
        const currPositionNum = parseInt(currPosition);
        if (currPositionNum + diceValue <= commonPathEndNum) {
            return String((currPositionNum + diceValue) % 52) as Position;
        } else {
            if ((currPositionNum + diceValue)  > victorySquareNum) {
                return null;
            }
            if ((currPositionNum + diceValue) === victorySquareNum) {
                return "victorySquare";
            } 
            
            // ((currPositionNum + diceValue)  < victorySquareNum) 
            const victoryPathSplitted = token.victoryPathEntry.split("-");
            return `${victoryPathSplitted[0]}-victory-${currPositionNum + diceValue}` as Position;
        }
    } else if (splitPosition[1] == "tokenStand") {
        if (diceValue === 6) {
            return CornerToHomeStopMap[state.currentTurn];
        }
        return null;
    } else if (splitPosition[1] === "victory") {
        const currPositionNum = parseInt(splitPosition[splitPosition.length - 1]);
        if ((currPositionNum + diceValue)  > victorySquareNum) {
            return null;
        }
        if (currPositionNum + diceValue === victorySquareNum) {
            return "victorySquare";
        } 
        // (currPositionNum + diceValue < victorySquareNum)
        return `${splitPosition[0]}-victory-${currPositionNum + diceValue}}` as Position;
    }
    return null;
}

function getToBeKilledToken(currentPlayer: Corner | null, tokenIds: TokenId[] | null) : TokenId | null {
    if (currentPlayer == null || tokenIds == null) return null;
    const otherPlayerTokens = tokenIds.filter((currTokId) => currTokId.split("-")[0] !== currentPlayer);
    if (otherPlayerTokens.length === 0) {
        return null;
    }
    const tokenMap = new Map<Corner, TokenId[]>();
    // Double tokens are not allowed to be killed.
    for (let i = 0; i < otherPlayerTokens.length; i++) {
        let tokenArr: TokenId[] = [];
        const player: Corner = otherPlayerTokens[i].split("-")[0] as Corner;
        if (tokenMap.has(player)) {
            tokenArr = tokenMap.get(player) || [];
        }
        tokenArr.push(otherPlayerTokens[i]);
        tokenMap.set(player, tokenArr);
    }
    for (const tokenIds of tokenMap.values()) {
        if (tokenIds.length > 1 && tokenIds.length % 2 === 1) {
            return tokenIds[0];
        }
    } 
    return null; 
} 

// function isFinished(tokenId: TokenId, tokenPosition: TokenPositionMap) : boolean {
//     return (tokenPosition[tokenId] === "victorySquare")
// }

function hasWon(player: Corner | null, state: GameState): boolean {
    if (player == null) return false;
    const tokenIds = state.cornerToPlayerMap[player]?.tokenIds || [];
    let finishedCount = 0;
    for (let i = 0; i < tokenIds.length; i++) {
        if (state.tokensPositions[tokenIds[i]] === "victorySquare") {
            finishedCount += 1;
        }
    }
    return finishedCount === 4;
}

function getDefaultTokenMap(): TokenMapType {
    const tokens : TokenMapType = {"bottumLeft-1": null, "bottumLeft-2": null, "bottumLeft-3": null, "bottumLeft-4": null,
               "bottumRight-1": null, "bottumRight-2":null, "bottumRight-3": null, "bottumRight-4": null,
               "topRight-1": null, "topRight-2": null, "topRight-3": null, "topRight-4": null,
               "topLeft-1": null, "topLeft-2": null, "topLeft-3": null, "topLeft-4": null};
    for ( let i = 0; i < TokenIds.length; i++) {
        const corner: Corner = TokenIds[i].split("-")[0] as Corner;
        const color: Color = DefaultCornerToColorMap[corner]; 
        tokens[TokenIds[i]] = {
            id: TokenIds[i],
            color: color,
            homeStopPos: CornerToHomeStopMap[corner],
            commonPathEnd: getPathEnd(CornerToHomeStopMap[corner]),
            victoryPathEntry: `${corner}-victory-52` as Position,
        }
    }
    return tokens;
}

function getPathEnd(homeStop: Position): Position {
    if (homeStop === "1") return "51";
    const pathEnd = parseInt(homeStop);
    return String(pathEnd - 2) as Position; 
}

function getTokenIds(corner: Corner): TokenId[] {
    return [
        `${corner}-1`,
        `${corner}-2`,
        `${corner}-3`,
        `${corner}-4`
    ]
}

function getDefaultPlayers(corneres: Corner[]) : CornerToPlayerMapType {
    const players: CornerToPlayerMapType = {"bottumLeft": null, "bottumRight": null, "topRight": null, "topLeft": null};
    for (let i = 0; i < corneres.length; i++) {
        const color = DefaultCornerToColorMap[corneres[i]];
        players[corneres[i]] = {
            id: `${corneres[i]}-player`,
            color: color,
            tokenIds: getTokenIds(corneres[i]),
            isPlaying: true,
        }
    }
    return players;
}