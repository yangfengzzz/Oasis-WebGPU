export class RenderPassDescriptor implements GPURenderPassDescriptor {
    label?: string;
    occlusionQuerySet?: GPUQuerySet;
    timestampWrites?: GPURenderPassTimestampWrites;
    depthStencilAttachment?: RenderPassDepthStencilAttachment;
    colorAttachments: RenderPassColorAttachment[];
}

export class RenderPassColorAttachment implements GPURenderPassColorAttachment {
    loadValue: GPULoadOp | GPUColor;
    storeOp: GPUStoreOp;
    view: GPUTextureView;
    resolveTarget?: GPUTextureView;
}

export class RenderPassDepthStencilAttachment implements GPURenderPassDepthStencilAttachment {
    view: GPUTextureView;
    depthLoadValue: GPULoadOp | number;
    depthReadOnly?: boolean;
    depthStoreOp: GPUStoreOp;
    stencilLoadValue: GPULoadOp | GPUStencilValue;
    stencilReadOnly?: boolean;
    stencilStoreOp: GPUStoreOp;
}