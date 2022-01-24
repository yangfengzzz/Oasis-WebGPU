import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";

/**
 * Depth state.
 */
export class DepthState {
    /** Whether to enable the depth test. */
    enabled: boolean = true;
    /** Whether the depth value can be written.*/
    writeEnabled: boolean = true;
    /** Depth comparison function. */
    compareFunction: GPUCompareFunction = 'less';

    platformApply(pipelineDescriptor: RenderPipelineDescriptor,
                  encoder: GPURenderPassEncoder): void {
        const { enabled, compareFunction, writeEnabled } = this;

        if (enabled) {
            // apply compare func.
            pipelineDescriptor.depthStencil.depthCompare = compareFunction;
            // apply write enabled.
            pipelineDescriptor.depthStencil.depthWriteEnabled = writeEnabled;
        }
    }
}