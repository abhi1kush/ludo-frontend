export type Color = "red" | "green" | "blue" | "yellow";
export type Corner = "topLeft" | "topRight" | "bottumRight" | "bottumLeft";

export interface Cell {
    x : number,
    y: number,
}

export interface Token {
  color: Color;
  id: TokenId;
  homeStopPos: Position;
  victoryPathEntry: Position;
  commonPathEnd: Position;
}

export interface Player {
  id: string;
  color: Color;
  tokenIds: TokenId[];
  isPlaying: boolean;
}

export interface Winner {
    playerColor: Color;
    rank: number;
}

export type Position = "bottumLeft-tokenStand-1"| "bottumLeft-tokenStand-2" | "bottumLeft-tokenStand-3" | "bottumLeft-tokenStand-4"
                | "bottumRight-tokenStand-1"| "bottumRight-tokenStand-2" | "bottumRight-tokenStand-3" | "bottumRight-tokenStand-4"
                | "topRight-tokenStand-1"| "topRight-tokenStand-2" | "topRight-tokenStand-3" | "topRight-tokenStand-4"
                | "topLeft-tokenStand-1"| "topLeft-tokenStand-2" | "topLeft-tokenStand-3" | "topLeft-tokenStand-4"
                | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14"
                | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "24" | "25" | "26" | "27"
                | "28" | "29" | "30" | "31" | "32" | "33" | "34" | "35" | "36" | "37" | "38" | "39" | "40"
                | "41" | "42" | "43" | "44" | "45" | "46" | "47" | "48" | "49" | "50" | "51" | "52" 
                | "bottumLeft-victory-52" | "bottumLeft-victory-53" | "bottumLeft-victory-54" | "bottumLeft-victory-55" | "bottumLeft-victory-56"
                | "bottumRight-victory-39" | "bottumRight-victory-40" | "bottumRight-victory-41" | "bottumRight-victory-42" | "bottumRight-victory-43"
                | "topRight-victory-26" | "topRight-victory-27" | "topRight-victory-28" | "topRight-victory-29" | "topRight-victory-30"
                | "topLeft-victory-13" | "topLeft-victory-14" | "topLeft-victory-15" | "topLeft-victory-16" | "topLeft-victory-17"
                | "victorySquare";

export type TokenId = "bottumLeft-1" | "bottumLeft-2" | "bottumLeft-3" | "bottumLeft-4"
               | "bottumRight-1"| "bottumRight-2"| "bottumRight-3" | "bottumRight-4"
               | "topRight-1" | "topRight-2" | "topRight-3" | "topRight-4"
               | "topLeft-1"| "topLeft-2"| "topLeft-3"| "topLeft-4";

export type TokenPositionMap = Record<TokenId, Position>;
export type BoardType = Record<Position, TokenId[] | null>;
export type TokenMapType = Record<TokenId, Token | null>;
export type CornerToPlayerMapType = Record<Corner, Player | null>;
export interface GameState {
  corners: Corner[],
  cornerToPlayerMap: CornerToPlayerMapType;
  tokensPositions: TokenPositionMap; // {Color}-[1234]
  tokenMap: TokenMapType;
  board: BoardType;
  winners: Winner[];
  currentTurn: Corner;
  diceValue: number | null;
}