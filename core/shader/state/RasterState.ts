import {DepthStencilState, PrimitiveState} from "../../webgpu/state";

export class RasterState {
    /** Specifies whether or not front- and/or back-facing polygons can be culled. */
    cullMode: GPUCullMode = 'back';
    /** The multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. */
    depthBias: number = 0;
    /** The scale factor for the variable depth offset for each polygon. */
    slopeScaledDepthBias: number = 0;

    platformApply(primitive: PrimitiveState,
                  depthStencil: DepthStencilState,
                  frontFaceInvert: boolean): void {
        const {cullMode, depthBias, slopeScaledDepthBias} = this;

        primitive.cullMode = cullMode;
        if (frontFaceInvert) {
            primitive.frontFace = 'cw';
        } else {
            primitive.frontFace = 'ccw';
        }

        if (depthBias !== 0 || slopeScaledDepthBias !== 0) {
            depthStencil.depthBiasSlopeScale = slopeScaledDepthBias;
            depthStencil.depthBias = depthBias;
        }
    }
}