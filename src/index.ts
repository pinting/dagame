import { Application } from "pixi.js";
import { Controller } from "./Controller";
import { Keyboard } from "./Keyboard";

const load = (app: Application) => {
    return new Promise<void>(resolve => {
        app.loader
            .add("Player", "assets/player.png")
            .add("Enemy", "assets/enemy.png")
            .add("Missile", "assets/missile.png")
            .add("Sky", "assets/sky.png")
            .add("Logo", "assets/logo.png")
            .load(() => resolve());
    });
};

const main = async () => {
    Keyboard.setup();
    
    const app = new Application({
        width: 800, 
        height: 600,
        antialias: true, 
        transparent: false, 
        resolution: 0.8
    });

    await load(app);

    document.body.appendChild(app.view);

    const controller = new Controller(app);

    app.stage.addChild(controller);

};

main();
