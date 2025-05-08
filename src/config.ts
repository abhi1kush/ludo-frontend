import type { Corner, Color } from "./types/globalTypes";

interface ConfigType {
    TOP_LEFT: Corner,
    TOP_RIGHT: Corner,
    BOTTUM_LEFT: Corner,
    BOTTUM_RIGHT:Corner,
    RED: Color,
    GREEN: Color,
    BLUE: Color,
    YELLOW: Color,
}

const CONFIG: ConfigType = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    BOTTUM_LEFT: "bottum-left",
    BOTTUM_RIGHT: "bottum-right",
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow",
}

export const HOME_COLORS: Color[] = [CONFIG.GREEN, CONFIG.YELLOW, CONFIG.BLUE, CONFIG.RED];
export const CORNERS: Corner[]  = [CONFIG.BOTTUM_LEFT, CONFIG.BOTTUM_RIGHT, CONFIG.TOP_RIGHT, CONFIG.TOP_LEFT];

export default CONFIG;