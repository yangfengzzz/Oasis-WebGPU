import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";

/**
 * Stencil state.
 */
export class StencilState {
    /** Whether to enable stencil test. */
    enabled: boolean = false;
    /** Write the reference value of the stencil buffer. */
    referenceValue: number = 0;
    /** Specifying a bit-wise mask that is used to AND the reference value and the stored stencil value when the test is done. */
    mask: number = 0xff;
    /** Specifying a bit mask to enable or disable writing of individual bits in the stencil planes. */
    writeMask: number = 0xff;
    /** The comparison function of the reference value of the front face of the geometry and the current buffer storage value. */
    compareFunctionFront: GPUCompareFunction = 'always';
    /** The comparison function of the reference value of the back of the geometry and the current buffer storage value. */
    compareFunctionBack: GPUCompareFunction = 'always';
    /** specifying the function to use for front face when both the stencil test and the depth test pass. */
    passOperationFront: GPUStencilOperation = 'keep';
    /** specifying the function to use for back face when both the stencil test and the depth test pass. */
    passOperationBack: GPUStencilOperation = 'keep';
    /** specifying the function to use for front face when the stencil test fails. */
    failOperationFront: GPUStencilOperation = 'keep';
    /** specifying the function to use for back face when the stencil test fails. */
    failOperationBack: GPUStencilOperation = 'keep';
    /** specifying the function to use for front face when the stencil test passes, but the depth test fails. */
    zFailOperationFront: GPUStencilOperation = 'keep';
    /** specifying the function to use for back face when the stencil test passes, but the depth test fails. */
    zFailOperationBack: GPUStencilOperation = 'keep';

    platformApply(pipelineDescriptor: RenderPipelineDescriptor,
                  encoder: GPURenderPassEncoder): void {
        const {
            enabled,
            referenceValue,
            mask,
            compareFunctionFront,
            compareFunctionBack,
            failOperationFront,
            zFailOperationFront,
            passOperationFront,
            failOperationBack,
            zFailOperationBack,
            passOperationBack,
            writeMask
        } = this;

        if (enabled) {
            encoder.setStencilReference(referenceValue);
            pipelineDescriptor.depthStencil.stencilReadMask = mask;
            pipelineDescriptor.depthStencil.stencilFront.compare = compareFunctionFront;
            pipelineDescriptor.depthStencil.stencilBack.compare = compareFunctionBack;
        }

        // apply stencil operation.
        pipelineDescriptor.depthStencil.stencilFront.failOp = failOperationFront;
        pipelineDescriptor.depthStencil.stencilFront.depthFailOp = zFailOperationFront;
        pipelineDescriptor.depthStencil.stencilFront.passOp = passOperationFront;

        pipelineDescriptor.depthStencil.stencilBack.failOp = failOperationBack;
        pipelineDescriptor.depthStencil.stencilBack.depthFailOp = zFailOperationBack;
        pipelineDescriptor.depthStencil.stencilBack.passOp = passOperationBack;

        // apply write mask.
        pipelineDescriptor.depthStencil.stencilWriteMask = writeMask;
    }
}