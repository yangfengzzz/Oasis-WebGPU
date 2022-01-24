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