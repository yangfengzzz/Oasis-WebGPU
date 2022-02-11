import {BindGroupLayoutDescriptor, ShaderModuleDescriptor} from "../webgpu";

type BindGroupLayoutDescriptorMap = Map<number, BindGroupLayoutDescriptor>;

/**
 * Shader program, corresponding to the GPU shader program.
 * @internal
 */
export class ShaderProgram {
    private static _shaderModuleDescriptor: ShaderModuleDescriptor = new ShaderModuleDescriptor();

    private _bindGroupLayoutDescriptorMap: BindGroupLayoutDescriptorMap;
    private _vertexShader: GPUShaderModule;
    private _fragmentShader: GPUShaderModule;
    private _device: GPUDevice;

    get vertexShader(): GPUShaderModule {
        return this._vertexShader;
    }

    get fragmentShader(): GPUShaderModule {
        return this._fragmentShader;
    }

    get bindGroupLayoutDescriptorMap(): BindGroupLayoutDescriptorMap {
        return this._bindGroupLayoutDescriptorMap;
    }

    constructor(device: GPUDevice, vertexSource: string, fragmentSource: string,
                bindGroupLayoutDescriptorMap: BindGroupLayoutDescriptorMap) {
        this._device = device;
        this._bindGroupLayoutDescriptorMap = bindGroupLayoutDescriptorMap;
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
