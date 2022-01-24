import {BlendState} from "./BlendState";
import {DepthState} from "./DepthState";
import {RasterState} from "./RasterState";
import {StencilState} from "./StencilState";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";

/**
 * Render state.
 */
export class RenderState {
    /** Blend state. */
    readonly blendState: BlendState = new BlendState();
    /** Depth state. */
    readonly depthState: DepthState = new DepthState();
    /** Stencil state. */
    readonly stencilState: StencilState = new StencilState();
    /** Raster state. */
    readonly rasterState: RasterState = new RasterState();

    /**
     * @internal
     */
    _apply(pipelineDescriptor: RenderPipelineDescriptor,
           encoder: GPURenderPassEncoder,
           frontFaceInvert: boolean): void {
        this.blendState.platformApply(pipelineDescriptor, encoder);
        this.depthState.platformApply(pipelineDescriptor, encoder);
        this.stencilState.platformApply(pipelineDescriptor, encoder);
        this.rasterState.platformApply(pipelineDescriptor, encoder, frontFaceInvert);
    }
}