import { Emitter } from "pixi-particles";
import { Application, Container, ParticleContainer, Sprite } from "pixi.js";
import { Coord } from "./Coord";
import { aliveBox, GameScene } from "./GameScene";
import { ICoord } from "./ICoord";
import { ICoordDynamic } from "./ICoordDynamic";
import { Keyboard } from "./Keyboard";
import { Missile } from "./Missile";
import { Rect } from "./Rect";
import { TickContainer } from "./TickContainer";
import { debug, deathAnimation } from "./Utils";

export interface IPlayerArgs {
    scene: GameScene;
    position: ICoordDynamic;
    controls: IPlayerControls;
    speed: ICoord;
    missileSpeed: ICoord;
    missileDelay: number
}

export interface IPlayerControls {
    up: string,
    right: string,
    down: string,
    left: string,
    shoot: string
};

export class Player extends TickContainer {
    private scene: GameScene;
    private controls: IPlayerControls;
    private speed: ICoord;
    private missileSpeed: ICoord;
    private missileDelay: number;

    private velocity: ICoord = { x: 0, y: 0 };
    private nextMissile: number = 0;
    private killed: boolean = false;
    private emitter: Emitter;

    public constructor(app: Application, args: IPlayerArgs) {
        super(app);

        this.scene = args.scene;
        this.controls = args.controls;
        this.speed = args.speed;
        this.missileSpeed = args.missileSpeed;
        this.missileDelay = args.missileDelay;

        this.addChild(new Sprite(
            this.app.loader.resources["Player"].texture
        ));

        const position = { ...args.position };

        Coord.resolve(position, this, this.app.renderer.screen);

        this.position.x = position.x;
        this.position.y = position.y;

        debug("Player added");
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

        this.emitter = new Emitter(emitterContainer, ["Player"], deathAnimation);
        
        this.emitter.emit = true;
        this.emitter.playOnceAndDestroy(() => this.scene.gameOver());
    }

    private processInput(): void {
        const up = Keyboard.keys[this.controls["up"]];
        const right = Keyboard.keys[this.controls["right"]];
        const down = Keyboard.keys[this.controls["down"]];
        const left = Keyboard.keys[this.controls["left"]];
        const shoot = Keyboard.keys[this.controls["shoot"]];
        
        // X axis
        if (left && !right) {
            this.velocity.x = -this.speed.x;
        }
        else if (!left && right) {
            this.velocity.x = this.speed.x;
        }
        else {
            this.velocity.x = 0;
        }

        // Y axis
        if (up && !down) {
            this.velocity.y = -this.speed.y;
        }
        else if (!up && down) {
            this.velocity.y = this.speed.y;
        }
        else {
            this.velocity.y = 0;
        }

        // Missile
        if (shoot && this.nextMissile <= 0) {
            this.nextMissile = this.missileDelay;

            this.createMissile();
        }
    }

    private createMissile(): void {
        const missile = new Missile(this.app, {
            scene: this.scene,
            position: {
                x: this.x + this.width,
                y: this.y + this.height / 2
            },
            speed: this.missileSpeed,
            aliveInBox: aliveBox(this.app)
        });

        this.scene.addChild(missile);
    }

    private processVelocity(delta: number): void {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }

    protected process(delta: number, time: number): void {
        if (this.killed) {
            return;
        }
        
        if (this.nextMissile > 0) {
            this.nextMissile -= delta;
        }

        this.processInput();
        this.processVelocity(delta);
        
        Rect.contain(this, this.app.renderer.screen);
    }
}
