import type { TokenId } from "../../types/globalTypes";

export const START_TWO_PLAYER_GAME = "START_TWO_PLAYER_GAME";
export const START_FOUR_PLAYER_GAME = "START_FOUR_PLAYER_GAME";
export const ROLL_DICE = 'ROLL_DICE';
export const MOVE_TOKEN = 'MOVE_TOKEN';
export const NEXT_TURN = 'NEXT_TURN';

export const startTwoPlayerGame = () => ({
    type: START_TWO_PLAYER_GAME as typeof START_TWO_PLAYER_GAME,
})

export const startFourPlayerGame = () => ({
    type: START_FOUR_PLAYER_GAME as typeof START_FOUR_PLAYER_GAME,
})

export const rollDice = () => ({
  type: ROLL_DICE as typeof ROLL_DICE,
});

export const moveToken = (tokenId: TokenId) => ({
  type: MOVE_TOKEN as typeof MOVE_TOKEN,
  payload: {tokenId },
});

export const nextTurn = () => ({
  type: NEXT_TURN as typeof NEXT_TURN,
});

export type GameAction =
  | ReturnType<typeof rollDice>
  | ReturnType<typeof moveToken>
  | ReturnType<typeof startFourPlayerGame>
  | ReturnType<typeof startTwoPlayerGame>;