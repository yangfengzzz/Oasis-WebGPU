import {ShaderModuleDescriptor} from "../webgpu";

/**
 * Shader program, corresponding to the GPU shader program.
 * @internal
 */
export class ShaderProgram {
    private static _shaderModuleDescriptor: ShaderModuleDescriptor = new ShaderModuleDescriptor();

    private _vertexShader: GPUShaderModule;
    private _fragmentShader: GPUShaderModule;
    private _device: GPUDevice;

    get vertexShader(): GPUShaderModule {
        return this._vertexShader;
    }

    get fragmentShader(): GPUShaderModule {
        return this._fragmentShader;
    }

    constructor(device: GPUDevice, vertexSource: string, fragmentSource: string) {
        this._device = device;
        this._createProgram(vertexSource, fragmentSource);
    }

    /**
     * init and link program with shader.
     */
    private _createProgram(vertexSource: string, fragmentSource: string) {
        ShaderProgram._shaderModuleDescriptor.code = vertexSource;
        this._vertexShader = this._device.createShaderModule(ShaderProgram._shaderModuleDescriptor);

        ShaderProgram._shaderModuleDescriptor.code = fragmentSource;
        this._fragmentShader = this._device.createShaderModule(ShaderProgram._shaderModuleDescriptor);
    }
}
