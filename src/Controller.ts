import { GameScene } from "./GameScene";
import { MenuScene } from "./MenuScene";
import { randomInt } from "./Utils";
import { FadeContainer } from "./FadeContainer";
import { Application, Container } from "pixi.js";

export class Controller extends Container {
    private app: Application;

    private menuScene: MenuScene;
    private gameScene: GameScene;

    public constructor(app: Application) {
        super();

        this.app = app;

        this.createMenuScene();
    }

    private menuHandler(item: string) {
        switch(item) {
            case "EXIT":
                this.exit();
                break;
            default:
                this.goToGame();
                break;
        }
    }

    private exit(): void {
        location.href = "https://pinting.github.io";
    }

    private goToGame(): void {
        if (!this.menuScene) {
            return;
        }

        this.menuScene.fadeOut(() => {
            this.menuScene.destroy();
            this.menuScene = undefined;
            this.createGameScene();
        });
    }

    private goToMenu(): void {
        if (!this.gameScene) {
            return;
        }

        this.gameScene.fadeOut(() => {
            this.gameScene.destroy();
            this.gameScene = undefined;
            this.createMenuScene();
        });
    }

    private createMenuScene(): void {
        if (this.menuScene) {
            return;
        }

        this.menuScene = new MenuScene(this.app, {
            items: ["GAME1", "GAME2", "GAME3", "EXIT"],
            fontSize: 34,
            marginSize: 48,
            skySpeed: 10,
            callback: (item) => this.menuHandler(item)
        });

        this.addChild(this.menuScene);
        this.menuScene.fadeIn();
    }

    private createGameScene(): void {
        if (this.gameScene) {
            return;
        }

        this.gameScene = new GameScene(this.app, {
            // Player options
            playerPosition: {
                x: 0,
                y: 0,
                bx: "left",
                by: "center"
            },
            playerControls: {
                up: "W",
                right: "D",
                down: "S",
                left: "A",
                shoot: "X"
            },
            playerSpeed: { x: 200, y: 200 },
            playerMissileSpeed: { x: 300, y: 0 },
            playerMissileDelay: 0.5,
            
            // Enemy options
            enemyPosition: {
                x: 200,
                y: randomInt(-100, 100),
                bx: "right",
                by: "center"
            },
            enemyDelay: 2,
            enemySpeed: { x: -50, y: 0 },

            // Game options
            skySpeed: 10,
            onGameOver: () => this.goToMenu()
        });
        
        this.gameScene.init();
        this.addChild(this.gameScene);
        this.gameScene.fadeIn();
    }
}