import { IRect } from "./IRect";

export class Rect {
    public static collide(a: IRect, b: IRect): boolean {
        const acx = a.x + a.width / 2; 
        const acy = a.y + a.height / 2; 
        const bcx = b.x + b.width / 2; 
        const bcy = b.y + b.height / 2; 

        const ahw = a.width / 2;
        const ahh = a.height / 2;
        const bhw = b.width / 2;
        const bhh = b.height / 2;

        const vx = acx - bcx;
        const vy = acy - bcy;

        const sw = ahw + bhw;
        const sh = ahh + bhh;

        return Math.abs(vx) < sw && Math.abs(vy) < sh;
    }

    public static inside(container: IRect, scene: IRect): boolean {
        // Left
        if (container.x < scene.x) {
            return false;
        }
    
        // Top
        if (container.y < scene.y) {
            return false;
        }
    
        // Right
        if (container.x + container.width > scene.width) {
            return false;
        }
    
        // Bottom
        if (container.y + container.height > scene.height) {
            return false;
        }
    
        return true;
    }
    
    public static contain(container: IRect, scene: IRect): "left" | "top" | "right" | "bottom" {
        let result: "left" | "top" | "right" | "bottom";
    
        // Left
        if (container.x < scene.x) {
            container.x = scene.x;
            result = "left";
        }
    
        // Top
        if (container.y < scene.y) {
            container.y = scene.y;
            result = "top";
        }
    
        // Right
        if (container.x + container.width > scene.width) {
            container.x = scene.width - container.width;
            result = "right";
        }
    
        // Bottom
        if (container.y + container.height > scene.height) {
            container.y = scene.height - container.height;
            result = "bottom";
        }
    
        return result;
    }
}