import { Emitter } from "pixi-particles";
import { Application, Container, Sprite, Ticker, utils } from "pixi.js";
import { Coord } from "./Coord";
import { GameScene } from "./GameScene";
import { ICoord } from "./ICoord";
import { ICoordDynamic } from "./ICoordDynamic";
import { IRect } from "./IRect";
import { Player } from "./Player";
import { Rect } from "./Rect";
import { StopTickProcess, TickContainer } from "./TickContainer";
import { debug, randomInt, deathAnimation } from "./Utils";

export interface IEnemyArgs {
    scene: GameScene;
    position: ICoordDynamic;
    speed: ICoord;
    oscillateScale: ICoord;
    oscillateSpeed: number;
    aliveInBox: IRect;
}

export class Enemy extends TickContainer {
    private scene: GameScene;
    private speed: ICoord;
    private oscillateScale: ICoord;
    private oscillateSpeed: number;
    private aliveInBox: IRect;
    
    private velocity: ICoord;
    private emitter: Emitter;
    private killed: boolean = false;

    public constructor(app: Application, args: IEnemyArgs) {
        super(app);

        this.scene = args.scene;
        this.speed = args.speed;
        this.oscillateScale = args.oscillateScale;
        this.oscillateSpeed = args.oscillateSpeed;
        this.aliveInBox = args.aliveInBox;
        
        this.velocity = args.speed;
        
        this.addChild(new Sprite(
            this.app.loader.resources["Enemy"].texture
        ));

        const position = { ...args.position };

        Coord.resolve(position, this, this.app.renderer.screen);
        
        this.position.x = position.x;
        this.position.y = position.y;

        this.time += randomInt(1, 1000);
        
        debug("Enemy added");
    }

    public isKilled(): boolean {
        return this.killed;
    }

    public kill(): void {
        if (this.killed) {
            return;
        }

        this.killed = true;

        const emitterContainer = new Container();

        this.removeChildren();
        this.addChild(emitterContainer);

        this.emitter = new Emitter(emitterContainer, ["Enemy"], deathAnimation);
        
        this.emitter.emit = true;
        this.emitter.playOnceAndDestroy(() => this.destroy());
    }

    private processCollision(): void {
        for (const child of this.scene.children) {
            if (child instanceof Player) {
                const player = child as Player;

                if (!player.isKilled() && Rect.collide(this, player)) {
                    player.kill();
                    throw new StopTickProcess();
                }
            }
        }
    }

    private processVelocity(delta: number, time: number): void {
        const t = time * this.oscillateSpeed;
        
        const vx = this.velocity.x + Math.sin(t) * this.oscillateScale.x;
        const vy = this.velocity.y + Math.sin(t) * this.oscillateScale.y;

        this.x += vx * delta;
        this.y += vy * delta;
    }

    private processDestroy(): void {
        if (!Rect.inside(this, this.aliveInBox)) {
            this.scene.removeChild(this)
            this.destroy();
            throw new StopTickProcess();
        }
    }

    protected process(delta: number, time: number): void {
        if (this.killed) {
            return;
        }

        this.processVelocity(delta, time);
        this.processDestroy();
        this.processCollision();
    }
}
