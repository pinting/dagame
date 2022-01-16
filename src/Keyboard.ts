export class Keyboard {
    public static keys: { [key: string]: boolean } = {};

    private static onKey(event, state: boolean): void {
        Keyboard.keys[event.key.toUpperCase()] = state;
        Keyboard.keys[event.key.toLowerCase()] = state;
        Keyboard.keys[event.keyCode] = state;
    }

    public static setup(): void {
        window.addEventListener("keydown", e => Keyboard.onKey(e, true), false);
        window.addEventListener("keyup", e => Keyboard.onKey(e, false), false);
    }
}