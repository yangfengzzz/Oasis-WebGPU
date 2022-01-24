export class RenderPipelineDescriptor implements GPURenderPipelineDescriptor {
    depthStencil: GPUDepthStencilState;
    fragment: GPUFragmentState;
    label: string;
    layout: GPUPipelineLayout;
    multisample: GPUMultisampleState;
    primitive: GPUPrimitiveState;
    vertex: GPUVertexState;
}