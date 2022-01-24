export class ColorTargetState implements GPUColorTargetState {
    blend: GPUBlendState;
    format: GPUTextureFormat;
    writeMask: GPUColorWriteFlags;

    constructor() {

    }
}