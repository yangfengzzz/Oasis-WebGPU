import {DepthStencilState} from "../../webgpu/state";

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

    platformApply(depthStencil: DepthStencilState): void {
        const { enabled, compareFunction, writeEnabled } = this;

        if (enabled) {
            // apply compare func.
            depthStencil.depthCompare = compareFunction;
            // apply write enabled.
            depthStencil.depthWriteEnabled = writeEnabled;
        }
    }
}