export class VertexState implements GPUVertexState {
    entryPoint: string;
    module: GPUShaderModule;
    buffers?: (VertexBufferLayout | null)[] = [];
    constants?: Record<string, GPUPipelineConstantValue> = {};
}

export class VertexBufferLayout implements GPUVertexBufferLayout {
    arrayStride: GPUSize64 = 0;
    attributes: VertexAttribute[] = [];
    stepMode?: GPUVertexStepMode = null;
}

export class VertexAttribute implements GPUVertexAttribute {
    private _semantic: string;
    private _format: GPUVertexFormat;
    private _offset: GPUSize64;
    private _shaderLocation: GPUIndex32;

    /**
     * Vertex semantic.
     */
    get semantic(): string {
        return this._semantic;
    }

    /**
     * Vertex data format.
     */
    get format(): GPUVertexFormat {
        return this._format;
    }

    /**
     * Vertex data byte offset.
     */
    get offset(): number {
        return this._offset;
    }

    /**
     * Vertex buffer binding index.
     */
    get shaderLocation(): GPUIndex32 {
        return this._shaderLocation;
    }

    constructor(semantic: string,
                offset: GPUSize64,
                format: GPUVertexFormat,
                shaderLocation: GPUIndex32) {
        this._semantic = semantic;
        this._offset = offset;
        this._format = format;
        this._shaderLocation = shaderLocation;
    }
}