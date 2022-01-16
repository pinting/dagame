import { ICoord } from "./ICoord";

export interface ICoordDynamic extends ICoord {
    x: number;
    y: number;
    bx?: "left" | "right" | "center"; // Base X
    by?: "top" | "bottom" | "center"; // Base Y
}