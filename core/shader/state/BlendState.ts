import {RenderTargetBlendState} from "./RenderTargetBlendState";
import {Color} from "@oasis-engine/math";
import {
    ColorTargetState as WGPUColorTargetState,
    BlendState as WGPUBlendState,
} from "../../webgpu/state/FragmentState";
import {RenderPipelineDescriptor} from "../../webgpu";

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

    private _colorTargetState: WGPUColorTargetState = new WGPUColorTargetState();
    private _blendState: WGPUBlendState = new WGPUBlendState();

    constructor() {
        this._colorTargetState.blend = this._blendState;
    }

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
        const {fragment, multisample} = pipelineDescriptor;

        if (enabled) {
            fragment.targets.length = 1;
            fragment.targets[0] = this._colorTargetState;
        } else {
            fragment.targets.length = 0;
        }

        if (enabled) {
            // apply blend factor.
            this._blendState.color.srcFactor = sourceColorBlendFactor;
            this._blendState.color.dstFactor = destinationColorBlendFactor;
            this._blendState.alpha.srcFactor = sourceAlphaBlendFactor;
            this._blendState.alpha.dstFactor = destinationAlphaBlendFactor;

            // apply blend operation.
            this._blendState.color.operation = colorBlendOperation;
            this._blendState.alpha.operation = alphaBlendOperation;

            // apply blend color.
            encoder.setBlendConstant([this.blendColor.r, this.blendColor.g, this.blendColor.b, this.blendColor.a]);

            // apply color mask.
            this._colorTargetState.writeMask = colorWriteMask;
        }

        // apply alpha to coverage.
        multisample.alphaToCoverageEnabled = this.alphaToCoverage;
    }
}