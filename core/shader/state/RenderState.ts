import {BlendState} from "./BlendState";
import {DepthState} from "./DepthState";
import {RasterState} from "./RasterState";
import {StencilState} from "./StencilState";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {DepthStencilState, FragmentState} from "../../webgpu/state";

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
    _apply(fragment: FragmentState,
           depthStencil: DepthStencilState,
           pipelineDescriptor: RenderPipelineDescriptor,
           encoder: GPURenderPassEncoder,
           frontFaceInvert: boolean): void {
        this.blendState.platformApply(fragment, pipelineDescriptor.multisample, encoder);
        this.depthState.platformApply(depthStencil);
        this.stencilState.platformApply(depthStencil, encoder);
        this.rasterState.platformApply(pipelineDescriptor.primitive, depthStencil, frontFaceInvert);
    }
}