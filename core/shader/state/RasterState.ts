import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";

export class RasterState {
    /** Specifies whether or not front- and/or back-facing polygons can be culled. */
    cullMode: GPUCullMode = 'back';
    /** The multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. */
    depthBias: number = 0;
    /** The scale factor for the variable depth offset for each polygon. */
    slopeScaledDepthBias: number = 0;

    platformApply(pipelineDescriptor: RenderPipelineDescriptor,
                  encoder: GPURenderPassEncoder, frontFaceInvert: boolean): void {
        const {cullMode, depthBias, slopeScaledDepthBias} = this;

        pipelineDescriptor.primitive.cullMode = cullMode;
        if (frontFaceInvert) {
            pipelineDescriptor.primitive.frontFace = 'cw';
        } else {
            pipelineDescriptor.primitive.frontFace = 'ccw';
        }

        if (depthBias !== 0 || slopeScaledDepthBias !== 0) {
            pipelineDescriptor.depthStencil.depthBiasSlopeScale = slopeScaledDepthBias;
            pipelineDescriptor.depthStencil.depthBias = depthBias;
        }
    }
}