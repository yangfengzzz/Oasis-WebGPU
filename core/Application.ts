import {Engine} from "./Engine";
import {View} from "./View";

export class Application {
    private _adapter: GPUAdapter;
    private _device: GPUDevice;
    private _view: View;

    /**
     * @brief Prepares the application for execution
     * @param engine The engine the application is being run on
     */
    async prepare(engine: Engine): Promise<boolean> {
        this._adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });

        this._device = await this._adapter.requestDevice();
        this._view = engine.createView(this._adapter, this._device);

        return true;
    }

    /**
     * @brief Updates the application
     * @param delta_time The time since the last update
     */
    update(delta_time: number): void {

    }
}