import {Engine} from "../Engine";

/**
 * Shader program, corresponding to the GPU shader program.
 * @internal
 */
export class ShaderProgram {
    vertexShader: GPUShaderModule;
    fragmentShader: GPUShaderModule;
    private _device: GPUDevice;

    constructor(engine: Engine, vertexSource: string, fragmentSource: string) {
        this._device = engine._hardwareRenderer.device;
        this._createProgram(vertexSource, fragmentSource);
    }

    /**
     * init and link program with shader.
     */
    private _createProgram(vertexSource: string, fragmentSource: string) {
        this.vertexShader = this._device.createShaderModule({
            code: vertexSource
        });

        this.fragmentShader = this._device.createShaderModule({
            code: fragmentSource
        });
    }
}