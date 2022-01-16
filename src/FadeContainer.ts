import { Application } from "pixi.js";
import { TickContainer } from "./TickContainer";

export class FadeContainer extends TickContainer {
    private fade: "in" | "out";
    private fadeCallback: () => void;

    constructor(app: Application) {
        super(app);

        this.alpha = 0;
    }

    public fadeIn(callback?: () => void): void {
        this.fade = "in";
        this.fadeCallback = callback;
    }

    public fadeOut(callback?: () => void): void {
        this.fade = "out";
        this.fadeCallback = callback;
    }

    protected process(delta: number, time: number): void {
        if (this.fade == "in") {
            if (this.alpha < 1) {
                this.alpha += delta;
            }

            if (this.alpha >= 1) {
                this.alpha = 1;
                this.fade = undefined;

                if (this.fadeCallback) {
                    this.fadeCallback();
                    this.fadeCallback = undefined;
                }
            }
        }
        else if (this.fade == "out") {
            if (this.alpha > 0) {
                this.alpha -= delta;
            }

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.fade = undefined;

                if (this.fadeCallback) {
                    this.fadeCallback();
                    this.fadeCallback = undefined;
                }
            }
        }
    }
}