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