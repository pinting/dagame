import { Application, Container, Sprite, Text, TilingSprite } from "pixi.js";
import { Coord } from "./Coord";
import { FadeContainer } from "./FadeContainer";
import { ICoordDynamic } from "./ICoordDynamic";

export interface IMenuSceneArgs {
    items: string[];
    fontSize: number;
    marginSize: number;
    skySpeed: number;
    callback: (item: string) => void;
}

export class MenuScene extends FadeContainer {
    private items: string[];
    private fontSize: number;
    private marginSize: number;
    private skySpeed: number;
    private callback: (item: string) => void;

    private sky: TilingSprite;

    public constructor(app: Application, args: IMenuSceneArgs) {
        super(app);

        this.items = args.items;
        this.fontSize = args.fontSize;
        this.marginSize = args.marginSize;
        this.skySpeed = args.skySpeed;
        this.callback = args.callback;

        this.addSky();
        this.addMenuScene();
        this.addLogo();
    }

    private addLogo(): void {
        const logo = new Sprite(this.app.loader.resources["Logo"].texture);

        const position: ICoordDynamic = {
            x: 0,
            y: 25,
            bx: "center",
            by: "top"
        };

        Coord.resolve(position, logo, this.app.renderer.screen);
        
        logo.x = position.x;
        logo.y = position.y;

        this.addChild(logo);
    }

    private addMenuScene(): void {
        for (let i = 0; i < this.items.length; i++) {
            const value = this.items[i] as string;
            const menuItem = new Text(value, { fill : 0xffffff, fontSize: this.fontSize });
    
            menuItem.interactive = true;
    
            menuItem.on("mousedown", e => {
                if (this.alpha == 1.0) {
                    this.callback(value);
                }
            });

            const position: ICoordDynamic = {
                x: 0,
                y: this.marginSize * i + 50,
                bx: "center",
                by: "center"
            };

            Coord.resolve(position, menuItem, this.app.renderer.screen);
    
            menuItem.x = position.x;
            menuItem.y = position.y;
    
            this.addChild(menuItem);
        }
    }

    private addSky(): void {
        const texture = this.app.loader.resources["Sky"].texture;

        this.sky = new TilingSprite(texture, texture.width, texture.height);
        
        this.addChild(this.sky);
    }
    
    protected process(delta: number, time: number): void {
        super.process(delta, time);
        
        if (this.sky) {
            this.sky.tilePosition.x -= delta * this.skySpeed
        }
    }
}