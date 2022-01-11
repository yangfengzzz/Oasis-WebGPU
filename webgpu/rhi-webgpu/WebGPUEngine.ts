import {Engine} from "../Engine";
import {WebCanvas} from "oasis-engine";
import {WebGPURenderer} from "./WebGPURenderer";

/**
 * WebGPU platform engine.
 */
export class WebGPUEngine extends Engine {
    /**
     * Create an engine suitable for the WebGPU platform.
     * @param canvas - Native web canvas
     */
    constructor(canvas: string | HTMLCanvasElement | OffscreenCanvas) {
        const webCanvas = new WebCanvas(
            <HTMLCanvasElement | OffscreenCanvas>(typeof canvas === "string" ? document.getElementById(canvas) : canvas)
        );
        const hardwareRenderer = new WebGPURenderer();

        super(webCanvas, hardwareRenderer);
    }

    /**
     * Web canvas.
     */
    get canvas(): WebCanvas {
        return this._canvas as WebCanvas;
    }
}