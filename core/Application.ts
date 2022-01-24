import {Engine} from "./Engine";

export class Application {
    private _device: GPUDevice;

    /**
     * @brief Prepares the application for execution
     * @param engine The engine the application is being run on
     */
    prepare(engine: Engine): boolean {
        return true;
    }

    /**
     * @brief Updates the application
     * @param delta_time The time since the last update
     */
    update(delta_time: number): void {

    }
}