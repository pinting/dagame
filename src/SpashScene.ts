import { Application, Text } from "pixi.js";
import { Coord } from "./Coord";
import { FadeContainer } from "./FadeContainer";
import { ICoordDynamic } from "./ICoordDynamic";

export class SplashScene extends FadeContainer {
    public constructor(app: Application) {
        super(app);

        const text = new Text("DAGAME", { fill : 0xffffff, fontSize: 48 });
        const position: ICoordDynamic = {
            x: 0,
            y: 0,
            bx: "center",
            by: "center"
        };

        Coord.resolve(position, text, this.app.renderer.screen);

        text.x = position.x;
        text.y = position.y;

        this.addChild(text);

        this.alpha = 1;
    }
}