import { ICoord } from "./ICoord";
import { ICoordDynamic } from "./ICoordDynamic";
import { IRect } from "./IRect";

export class Coord {
    public static distance(a: ICoord, b: ICoord): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    public static add(a: ICoord, b: ICoord): ICoord {
        return { x: a.x + b.x, y: a.y + b.y };
    }

    public static sub(a: ICoord, b: ICoord): ICoord {
        return { x: a.x - b.x, y: a.y - b.y };
    }

    public static equals(a: ICoord, b: ICoord): boolean {
        return a.x == b.x && a.y == b.y;
    }
    
    public static resolve(coord: ICoordDynamic, rect: IRect, bounds: IRect): void {
        switch(coord.bx) {
            case "left":
                coord.x += 0;
                break;
            case "right":
                coord.x += bounds.width - rect.width;
                break;
            case "center":
                coord.x += bounds.width / 2 - rect.width / 2;
                break;
        }

        switch(coord.by) {
            case "top":
                coord.y += 0;
                break;
            case "bottom":
                coord.y += bounds.height - rect.height;
                break;
            case "center":
                coord.y += bounds.height / 2 - rect.height / 2;
                break;
        }
    }
}