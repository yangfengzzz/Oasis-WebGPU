import {RenderTargetBlendState} from "./RenderTargetBlendState";
import {Color} from "@oasis-engine/math";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {DepthStencilState} from "../../webgpu/DepthStencilState";
import {ColorTargetState} from "../../webgpu/ColorTargetState";

/**
 * Blend state.
 */
export class BlendState {
    /** The blend state of the render target. */
    readonly targetBlendState: RenderTargetBlendState = new RenderTargetBlendState();
    /** Constant blend color. */
    readonly blendColor: Color = new Color(0, 0, 0, 0);
    /** Whether to use (Alpha-to-Coverage) technology. */
    alphaToCoverage: boolean = false;

    private _state: ColorTargetState = new ColorTargetState();

    platformApply(pipelineDescriptor: RenderPipelineDescriptor,
                  depthStencilDescriptor: DepthStencilState,
                  encoder: GPURenderPassEncoder): void {
        const {
            enabled,
            colorBlendOperation,
            alphaBlendOperation,
            sourceColorBlendFactor,
            destinationColorBlendFactor,
            sourceAlphaBlendFactor,
            destinationAlphaBlendFactor,
            colorWriteMask
        } = this.targetBlendState;

        if (enabled) {
            pipelineDescriptor.fragment.targets[0] = this._state;
        } else {
            pipelineDescriptor.fragment.targets[0] = null;
        }

        if (enabled) {
            // apply blend factor.
            this._state.blend.color.srcFactor = sourceColorBlendFactor;
            this._state.blend.color.dstFactor = destinationColorBlendFactor;
            this._state.blend.alpha.srcFactor = sourceAlphaBlendFactor;
            this._state.blend.alpha.dstFactor = destinationAlphaBlendFactor;

            // apply blend operation.
            this._state.blend.color.operation = colorBlendOperation;
            this._state.blend.alpha.operation = alphaBlendOperation;

            // apply blend color.
            encoder.setBlendConstant([this.blendColor.r, this.blendColor.g, this.blendColor.b, this.blendColor.a]);

            // apply color mask.
            this._state.writeMask = colorWriteMask;
        }

        // apply alpha to coverage.
        if (this.alphaToCoverage) {
            pipelineDescriptor.multisample.alphaToCoverageEnabled = true;
        } else {
            pipelineDescriptor.multisample.alphaToCoverageEnabled = false;
        }
    }
}