export class RenderPassDescriptor implements GPURenderPassDescriptor {
    colorAttachments: Iterable<GPURenderPassColorAttachment>;
    depthStencilAttachment: GPURenderPassDepthStencilAttachment;
    label: string;
    occlusionQuerySet: GPUQuerySet;
    timestampWrites: GPURenderPassTimestampWrites;
}