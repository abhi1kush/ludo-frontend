export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export const PlayerColors: PlayerColor[] = ['red', 'green', 'blue', 'yellow'];

export interface Cell {
    x : number,
    y: number,
}

export interface Token {
  id: number;
  position: number; // -1 for home, 0-56 for board positions
  isCompleted: boolean;
}

export interface Player {
  id: number;
  color: PlayerColor;
  tokens: Token[];
  hasWon: boolean;
  rank: number;
}

export interface GameState {
  players: Player[];
  winners: number[];
  currentTurn: PlayerColor;
  diceValue: number | null;
}