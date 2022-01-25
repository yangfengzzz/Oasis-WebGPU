export class BindGroupLayoutDescriptor implements GPUBindGroupLayoutDescriptor {
    label?: string;
    entries: BindGroupLayoutEntry[] = [];
}

export class BindGroupLayoutEntry implements GPUBindGroupLayoutEntry {
    binding: GPUIndex32;
    visibility: GPUShaderStageFlags;
    buffer?: BufferBindingLayout;
    externalTexture?: ExternalTextureBindingLayout;
    sampler?: SamplerBindingLayout;
    storageTexture?: StorageTextureBindingLayout;
    texture?: TextureBindingLayout;
}

export class BufferBindingLayout implements GPUBufferBindingLayout {
    type?: GPUBufferBindingType;
    hasDynamicOffset?: boolean;
    minBindingSize?: GPUSize64;
}

export class ExternalTextureBindingLayout implements GPUExternalTextureBindingLayout {
}

export class SamplerBindingLayout implements GPUSamplerBindingLayout {
    type?: GPUSamplerBindingType;
}

export class StorageTextureBindingLayout implements GPUStorageTextureBindingLayout {
    format: GPUTextureFormat;
    access?: GPUStorageTextureAccess;
    viewDimension?: GPUTextureViewDimension;
}

export class TextureBindingLayout implements GPUTextureBindingLayout {
    sampleType?: GPUTextureSampleType;
    viewDimension?: GPUTextureViewDimension;
    multisampled?: boolean;
}