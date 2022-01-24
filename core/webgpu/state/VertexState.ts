export class VertexState implements GPUVertexState {
    private _buffers?: (VertexBufferLayout | null)[] = null;
    private _constants?: Record<string, GPUPipelineConstantValue> = null;

    entryPoint: string;
    module: GPUShaderModule;

    get buffers(): (VertexBufferLayout | null)[] {
        if (this._buffers === null) {
            this._buffers = [];
        }
        return this._buffers;
    }

    set buffers(value: (VertexBufferLayout | null)[] | null | undefined) {
        if (value === null || value === undefined) {
            this._buffers = null;
        } else {
            if (value !== this._buffers) {
                this._buffers = [];
                this._buffers.length = value.length;
                for (let i = 0, n = value.length; i < n; i++) {
                    const buffer = value[i];
                    if (buffer !== null) {
                        this._buffers[i] = buffer.clone();
                    }
                }
            }
        }
    }

    get constants(): Record<string, GPUPipelineConstantValue> {
        if (this._constants === null) {
            this._constants = {};
        }
        return this._constants;
    }

    set constants(value: Record<string, GPUPipelineConstantValue> | null | undefined) {
        this._constants = value;
    }

    clone(): VertexState {
        return this.cloneTo(new VertexState());
    }

    cloneTo(out: VertexState): VertexState {
        out.entryPoint = this.entryPoint;
        out.module = this.module;
        out._constants = this._constants;
        if (this._buffers == null) {
            out._buffers = null;
        } else {
            out._buffers = [];
            out._buffers.length = this._buffers.length;
            for (let i = 0, n = this._buffers.length; i < n; i++) {
                const buffer = this._buffers[i];
                if (buffer !== null) {
                    out._buffers[i] = buffer.clone();
                }
            }
        }
        return out;
    }
}

export class VertexBufferLayout implements GPUVertexBufferLayout {
    arrayStride: GPUSize64 = 0;
    attributes: VertexAttribute[] = [];
    stepMode?: GPUVertexStepMode = null;

    clone(): VertexBufferLayout {
        return this.cloneTo(new VertexBufferLayout());
    }

    cloneTo(layout: VertexBufferLayout): VertexBufferLayout {
        layout.arrayStride = this.arrayStride;
        layout.stepMode = this.stepMode;
        layout.attributes = [];
        layout.attributes.length = this.attributes.length;
        for (let i = 0, n = this.attributes.length; i < n; i++) {
            layout.attributes[i] = this.attributes[i].clone();
        }
        return layout;
    }
}

export class VertexAttribute implements GPUVertexAttribute {
    format: GPUVertexFormat;
    offset: GPUSize64;
    shaderLocation: GPUIndex32;

    clone(): VertexAttribute {
        return this.cloneTo(new VertexAttribute());
    }

    cloneTo(attribute: VertexAttribute): VertexAttribute {
        attribute.format = this.format;
        attribute.offset = this.offset;
        attribute.shaderLocation = this.shaderLocation;
        return attribute;
    }
}