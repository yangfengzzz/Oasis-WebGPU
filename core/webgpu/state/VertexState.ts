export class VertexState implements GPUVertexState {
    entryPoint: string;
    module: GPUShaderModule;
    buffers?: (VertexBufferLayout | null)[];
    constants?: Record<string, GPUPipelineConstantValue>;
}

export class VertexBufferLayout implements GPUVertexBufferLayout {
    arrayStride: GPUSize64 = 0;
    attributes: VertexAttribute[] = [];
    stepMode?: GPUVertexStepMode = null;
}

export class VertexAttribute implements GPUVertexAttribute {
    format: GPUVertexFormat;
    offset: GPUSize64;
    shaderLocation: GPUIndex32;
}