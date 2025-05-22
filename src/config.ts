import type { Corner, Color , TokenId, Position } from "./types/globalTypes";

interface ConfigType {
    TOP_LEFT: Corner,
    TOP_RIGHT: Corner,
    BOTTUM_LEFT: Corner,
    BOTTUM_RIGHT:Corner,
    RED: Color,
    GREEN: Color,
    BLUE: Color,
    YELLOW: Color,
    MIN_X: number;
    MIN_Y: number;
}

const CONFIG: ConfigType = {
    TOP_LEFT: "topLeft",
    TOP_RIGHT: "topRight",
    BOTTUM_LEFT: "bottumLeft",
    BOTTUM_RIGHT: "bottumRight",
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow",
    MIN_X: 10,
    MIN_Y: 10,
}

export const CornerToHomeStopMap: Record<Corner, Position> = {
    "bottumLeft": "1",
    "topLeft": "14",
    "topRight": "27",
    "bottumRight": "40",
}

export const CornerToPathEndMap: Record<Corner, Position> = {
    "bottumLeft": "1",
    "topLeft": "14",
    "topRight": "27",
    "bottumRight": "40",
}

export const TokenIds: TokenId[] = [
    "bottumLeft-1" ,
    "bottumLeft-2" ,
    "bottumLeft-3" ,
    "bottumLeft-4" ,
    "bottumRight-1",
    "bottumRight-2",
    "bottumRight-3",
    "bottumRight-4",
    "topRight-1",
    "topRight-2",
    "topRight-3",
    "topRight-4",
    "topLeft-1",
    "topLeft-2",
    "topLeft-3",
    "topLeft-4",
]



export const Colors: Color[] = [CONFIG.GREEN, CONFIG.YELLOW, CONFIG.BLUE, CONFIG.RED];
export const Corners: Corner[]  = [CONFIG.BOTTUM_LEFT, CONFIG.BOTTUM_RIGHT, CONFIG.TOP_RIGHT, CONFIG.TOP_LEFT];

export const DefaultCornerToColorMap = {
    [CONFIG.BOTTUM_LEFT]: CONFIG.GREEN,
    [CONFIG.BOTTUM_RIGHT]: CONFIG.YELLOW, 
    [CONFIG.TOP_RIGHT]: CONFIG.BLUE, 
    [CONFIG.TOP_LEFT]: CONFIG.RED,
}

export default CONFIG;