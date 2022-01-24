export class PipelineLayoutDescriptor implements GPUPipelineLayoutDescriptor {
    bindGroupLayouts: Iterable<GPUBindGroupLayout>;
    label: string;
}