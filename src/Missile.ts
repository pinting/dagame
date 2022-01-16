import { Application, Container, Sprite, Ticker, utils } from "pixi.js";
import { Coord } from "./Coord";
import { Enemy } from "./Enemy";
import { GameScene } from "./GameScene";
import { ICoord } from "./ICoord";
import { ICoordDynamic } from "./ICoordDynamic";
import { IRect } from "./IRect";
import { Player } from "./Player";
import { Rect } from "./Rect";
import { StopTickProcess, TickContainer } from "./TickContainer";
import { debug } from "./Utils";

export interface IMissileArgs {
    scene: GameScene;
    position: ICoord;
    speed: ICoord;
    aliveInBox: IRect;
}

export class Missile extends TickContainer {
    private scene: GameScene;
    private speed: ICoord;
    private aliveInBox: IRect;

    private velocity: ICoord;

    public constructor(app: Application, args: IMissileArgs) {
        super(app);

        this.scene = args.scene;
        this.speed = args.speed;
        this.aliveInBox = args.aliveInBox;

        this.velocity = args.speed;
        
        this.addChild(new Sprite(
            this.app.loader.resources["Missile"].texture
        ));
        
        this.position.x = args.position.x;
        this.position.y = args.position.y;
        
        debug("Missile added");
    }

    public kill(): void {
        this.destroy();
    }

    private processCollision(): void {
        for (const child of this.scene.children) {
            if (child instanceof Enemy) {
                const enemy = child as Enemy;

                if (!enemy.isKilled() && Rect.collide(this, enemy)) {
                    debug("Missile hit");
                    enemy.kill();
                    this.kill();
                    throw new StopTickProcess();
                }
            }
        }
    }

    private processVelocity(delta: number, time: number): void {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }

    private processDestroy(): void {
        if (!Rect.inside(this, this.aliveInBox)) {
            debug("Missile removed");
            this.scene.removeChild(this)
            this.destroy();
            throw new StopTickProcess();
        }
    }

    protected process(delta: number, time: number): void {
        this.processVelocity(delta, time);
        this.processDestroy();
        this.processCollision();
    }
}
