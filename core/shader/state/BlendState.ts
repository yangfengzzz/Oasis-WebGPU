import {RenderTargetBlendState} from "./RenderTargetBlendState";
import {Color} from "@oasis-engine/math";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {ColorTargetState} from "../../webgpu/state/FragmentState";

/**
 * Blend state.
 */
export class BlendState {
    private static _colorTargetState: ColorTargetState = new ColorTargetState();

    /** The blend state of the render target. */
    readonly targetBlendState: RenderTargetBlendState = new RenderTargetBlendState();
    /** Constant blend color. */
    readonly blendColor: Color = new Color(0, 0, 0, 0);
    /** Whether to use (Alpha-to-Coverage) technology. */
    alphaToCoverage: boolean = false;


    platformApply(pipelineDescriptor: RenderPipelineDescriptor,
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
            pipelineDescriptor.fragment.targets[0] = BlendState._colorTargetState;
        } else {
            pipelineDescriptor.fragment.targets[0] = null;
        }

        if (enabled) {
            // apply blend factor.
            BlendState._colorTargetState.blend.color.srcFactor = sourceColorBlendFactor;
            BlendState._colorTargetState.blend.color.dstFactor = destinationColorBlendFactor;
            BlendState._colorTargetState.blend.alpha.srcFactor = sourceAlphaBlendFactor;
            BlendState._colorTargetState.blend.alpha.dstFactor = destinationAlphaBlendFactor;

            // apply blend operation.
            BlendState._colorTargetState.blend.color.operation = colorBlendOperation;
            BlendState._colorTargetState.blend.alpha.operation = alphaBlendOperation;

            // apply blend color.
            encoder.setBlendConstant([this.blendColor.r, this.blendColor.g, this.blendColor.b, this.blendColor.a]);

            // apply color mask.
            BlendState._colorTargetState.writeMask = colorWriteMask;
        }

        // apply alpha to coverage.
        pipelineDescriptor.multisample.alphaToCoverageEnabled = this.alphaToCoverage;
    }
}