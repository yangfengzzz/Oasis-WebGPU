export class RenderPipelineDescriptor implements GPURenderPipelineDescriptor {
    private _label?: string = null;
    private _vertex: VertexState = new VertexState();
    private _fragment?: FragmentState = null;
    private _primitive?: PrimitiveState = null;
    private _depthStencil?: DepthStencilState = null;
    private _multisample?: MultisampleState = null;

    layout?: GPUPipelineLayout = null;

    get label(): string | null {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get vertex() {
        return this._vertex;
    }

    set vertex(value: VertexState) {
        if (value !== this._vertex) {
            value.cloneTo(this._vertex);
        }
    }

    get fragment(): FragmentState {
        if (this._fragment === null) {
            this._fragment = new FragmentState();
        }
        return this._fragment;
    }

    set fragment(value: FragmentState | null | undefined) {
        if (value === null || value === undefined) {
            this._fragment = null;
        } else {
            if (value !== this._fragment) {
                if (this._fragment) {
                    value.cloneTo(this._fragment);
                } else {
                    this._fragment = value.clone();
                }
            }
        }
    }

    get primitive(): PrimitiveState {
        if (this._primitive === null) {
            this._primitive = new PrimitiveState();
        }
        return this._primitive;
    }

    set primitive(value: PrimitiveState | null | undefined) {
        if (value === null || value === undefined) {
            this._primitive = null;
        } else {
            if (value !== this._primitive) {
                if (this._primitive) {
                    value.cloneTo(this._primitive);
                } else {
                    this._primitive = value.clone();
                }
            }
        }
    }

    get depthStencil(): DepthStencilState {
        if (this._depthStencil === null) {
            this._depthStencil = new DepthStencilState();
        }
        return this._depthStencil;
    }

    set depthStencil(value: DepthStencilState | null | undefined) {
        if (value === null || value === undefined) {
            this._depthStencil = null;
        } else {
            if (value !== this._depthStencil) {
                if (this._depthStencil) {
                    value.cloneTo(this._depthStencil);
                } else {
                    this._depthStencil = value.clone();
                }
            }
        }
    }

    get multisample(): MultisampleState {
        if (this._multisample === null) {
            this._multisample = new MultisampleState();
        }
        return this._multisample;
    }

    set multisample(value: MultisampleState | null | undefined) {
        if (value === null || value === undefined) {
            this._multisample = null;
        } else {
            if (value !== this._multisample) {
                if (this._multisample) {
                    value.cloneTo(this._multisample);
                } else {
                    this._multisample = value.clone();
                }
            }
        }
    }
}

//---------------------------------------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------------------------------------------------------
export class FragmentState implements GPUFragmentState {
    private _constants?: Record<string, GPUPipelineConstantValue>;

    entryPoint: string;
    module: GPUShaderModule;
    targets: ColorTargetState[] = [];

    get constants(): Record<string, GPUPipelineConstantValue> {
        if (this._constants === null) {
            this._constants = {};
        }
        return this._constants;
    }

    set constants(value: Record<string, GPUPipelineConstantValue> | null | undefined) {
        this._constants = value;
    }

    clone(): FragmentState {
        return this.cloneTo(new FragmentState());
    }

    cloneTo(state: FragmentState): FragmentState {
        state.entryPoint = this.entryPoint;
        state.module = this.module;
        state._constants = this._constants;
        state.targets = [];
        state.targets.length = this.targets.length;
        for (let i = 0, n = this.targets.length; i < n; i++) {
            state.targets[i] = this.targets[i].clone();
        }
        return state
    }
}

export class ColorTargetState implements GPUColorTargetState {
    blend: BlendState;
    format: GPUTextureFormat;
    writeMask: GPUColorWriteFlags;

    clone(): ColorTargetState {
        return this.cloneTo(new ColorTargetState());
    }

    cloneTo(state: ColorTargetState): ColorTargetState {
        this.blend.cloneTo(state.blend);
        state.format = this.format;
        state.writeMask = this.writeMask;
        return state
    }
}

export class BlendState implements GPUBlendState {
    alpha: BlendComponent;
    color: BlendComponent;

    clone(): BlendState {
        return this.cloneTo(new BlendState());
    }

    cloneTo(state: BlendState): BlendState {
        this.alpha.cloneTo(state.alpha);
        this.color.cloneTo(state.color);
        return state
    }
}

export class BlendComponent implements GPUBlendComponent {
    operation?: GPUBlendOperation;
    srcFactor?: GPUBlendFactor;
    dstFactor?: GPUBlendFactor;

    clone(): BlendComponent {
        return this.cloneTo(new BlendComponent());
    }

    cloneTo(component: BlendComponent): BlendComponent {
        component.operation = this.operation;
        component.srcFactor = this.srcFactor;
        component.dstFactor = this.dstFactor;
        return component;
    }
}

//---------------------------------------------------------------------------------------------------------------------
export class PrimitiveState implements GPUPrimitiveState {
    topology?: GPUPrimitiveTopology;
    stripIndexFormat?: GPUIndexFormat;
    frontFace?: GPUFrontFace;
    cullMode?: GPUCullMode;
    unclippedDepth?: boolean;

    clone(): PrimitiveState {
        return this.cloneTo(new PrimitiveState());
    }

    cloneTo(state: PrimitiveState): PrimitiveState {
        state.topology = this.topology;
        state.stripIndexFormat = this.stripIndexFormat;
        state.frontFace = this.frontFace;
        state.cullMode = this.cullMode;
        state.unclippedDepth = this.unclippedDepth;
        return state;
    }
}

//---------------------------------------------------------------------------------------------------------------------
export class DepthStencilState implements GPUDepthStencilState {
    format: GPUTextureFormat;
    depthWriteEnabled?: boolean;
    depthCompare?: GPUCompareFunction;
    stencilFront?: StencilFaceState;
    stencilBack?: StencilFaceState;
    stencilReadMask?: GPUStencilValue;
    stencilWriteMask?: GPUStencilValue;
    depthBias?: GPUDepthBias;
    depthBiasSlopeScale?: number;
    depthBiasClamp?: number;

    clone(): DepthStencilState {
        return this.cloneTo(new DepthStencilState());
    }

    cloneTo(state: DepthStencilState): DepthStencilState {
        state.format = this.format;
        state.depthWriteEnabled = this.depthWriteEnabled;
        state.depthCompare = this.depthCompare;
        if (this.stencilFront) {
            if (state.stencilFront) {
                this.stencilFront.cloneTo(state.stencilFront);
            } else {
                state.stencilFront = this.stencilFront.clone();
            }
        } else {
            state.stencilFront = this.stencilFront;
        }
        if (this.stencilBack) {
            if (state.stencilBack) {
                this.stencilBack.cloneTo(state.stencilBack);
            } else {
                state.stencilBack = this.stencilBack.clone();
            }
        } else {
            state.stencilBack = this.stencilBack;
        }
        state.stencilReadMask = this.stencilReadMask;
        state.stencilWriteMask = this.stencilWriteMask;
        state.depthBias = this.depthBias;
        state.depthBiasSlopeScale = this.depthBiasSlopeScale;
        state.depthBiasClamp = this.depthBiasClamp;
        return state;
    }
}

export class StencilFaceState implements GPUStencilFaceState {
    compare?: GPUCompareFunction;
    failOp?: GPUStencilOperation;
    depthFailOp?: GPUStencilOperation;
    passOp?: GPUStencilOperation;

    clone(): StencilFaceState {
        return this.cloneTo(new StencilFaceState());
    }

    cloneTo(state: StencilFaceState): StencilFaceState {
        state.compare = this.compare;
        state.failOp = this.failOp;
        state.depthFailOp = this.depthFailOp;
        state.passOp = this.passOp;
        return state;
    }
}

//---------------------------------------------------------------------------------------------------------------------
export class MultisampleState implements GPUMultisampleState {
    count?: GPUSize32;
    mask?: GPUSampleMask;
    alphaToCoverageEnabled?: boolean;

    clone(): MultisampleState {
        return this.cloneTo(new MultisampleState());
    }

    cloneTo(state: MultisampleState): MultisampleState {
        state.count = this.count;
        state.mask = this.mask;
        state.alphaToCoverageEnabled = this.alphaToCoverageEnabled;
        return state;
    }
}