import { Application, Container } from "pixi.js";

export class StopTickProcess extends Error {
    // Empty
}

export abstract class TickContainer extends Container {
    protected time: number = 0;
    protected app: Application;

    public constructor(app: Application) {
        super();

        this.app = app;

        this.on("removed", () => this.app.ticker.remove(this.handleTick, this));
        this.on("added", () => this.app.ticker.add(this.handleTick, this));
    }

    private handleTick(deltaTime: number): void {
        const deltaMS = this.app.ticker.deltaMS;
        const delta = deltaMS / 1000;

        this.time += delta;

        try {
            this.process(delta, this.time);
        }
        catch(error) {
            if (!(error instanceof StopTickProcess)) {
                throw error;
            }
        }
    }
    
    public destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; }): void {
        this.app.ticker.remove(this.handleTick, this);
        super.destroy(options);
    }

    protected abstract process(delta: number, time: number);
}