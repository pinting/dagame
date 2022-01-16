import { Application, Container, DisplayObject, Sprite, TilingSprite } from "pixi.js";
import { Enemy } from "./Enemy";
import { IPlayerControls, Player } from "./Player";
import { debug, randomInt } from "./Utils";
import { IRect } from "./IRect";
import { ICoord } from "./ICoord";
import { ICoordDynamic } from "./ICoordDynamic";
import { FadeContainer } from "./FadeContainer";

export const aliveBox = (app: Application) => {
    return {
        x: app.renderer.screen.x - app.renderer.screen.width,
        y: app.renderer.screen.y - app.renderer.screen.height,
        width: app.renderer.screen.width * 2,
        height: app.renderer.screen.height * 2
    };
}

export interface IGameSceneArgs {
    playerPosition: ICoordDynamic;
    playerControls: IPlayerControls;
    playerSpeed: ICoord;
    playerMissileSpeed: ICoord;
    playerMissileDelay: number;
    enemyPosition: ICoordDynamic;
    enemySpeed: ICoord;
    enemyDelay: number;
    skySpeed: number;
    onGameOver: () => void;
}

export class GameScene extends FadeContainer {
    private playerPosition: ICoordDynamic;
    private playerControls: IPlayerControls;
    private playerSpeed: ICoord;
    private playerMissileSpeed: ICoord;
    private playerMissileDelay: number;
    private enemyPosition: ICoordDynamic;
    private enemySpeed: ICoord;
    private enemyDelay: number;
    private skySpeed: number;
    private onGameOver: () => void;

    private remainingTimeUntilEnemy: number;
    private sky: TilingSprite;

    public constructor(app: Application, args: IGameSceneArgs) {
        super(app);

        this.playerPosition = args.playerPosition;
        this.playerControls = args.playerControls;
        this.playerSpeed = args.playerSpeed;
        this.playerMissileSpeed = args.playerMissileSpeed;
        this.playerMissileDelay = args.playerMissileDelay;
        this.enemyPosition = args.enemyPosition;
        this.enemySpeed = args.enemySpeed;
        this.enemyDelay = args.enemyDelay;
        this.skySpeed = args.skySpeed;
        this.onGameOver = args.onGameOver;

        this.remainingTimeUntilEnemy = args.enemyDelay;
    }

    public init(): void {
        this.addSky();
        this.addPlayer();
    }

    private addSky(): void {
        const texture = this.app.loader.resources["Sky"].texture;

        this.sky = new TilingSprite(texture, texture.width, texture.height);
        
        this.addChild(this.sky);
    }

    private addPlayer(): void {
        const player = new Player(this.app, {
            scene: this,
            position: this.playerPosition,
            controls: this.playerControls,
            speed: this.playerSpeed,
            missileSpeed: this.playerMissileSpeed,
            missileDelay: this.playerMissileDelay
        });

        this.addChild(player);
    }

    private addEnemy(): void {
        const enemy = new Enemy(this.app, {
            scene: this,
            position: this.enemyPosition, 
            speed: this.enemySpeed,
            oscillateScale: { x: 0, y: 200 },
            oscillateSpeed: randomInt(1, 2),
            aliveInBox: aliveBox(this.app)
        });
        
        this.addChild(enemy);
    }

    public reload(): void {
        const children = this.removeChildren();

        for (const child of children) {
            child.destroy();
        }

        this.init();
    }

    public gameOver(): void {
        this.onGameOver();
    }

    protected process(delta: number, time: number): void {
        super.process(delta, time);
        
        if (this.sky) {
            this.sky.tilePosition.x -= delta * this.skySpeed
        }

        this.remainingTimeUntilEnemy -= delta;

        if (this.remainingTimeUntilEnemy <= 0) {
            this.remainingTimeUntilEnemy = this.enemyDelay;
            this.addEnemy();
        }
    }
}
