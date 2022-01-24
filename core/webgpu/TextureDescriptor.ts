class TextureDescriptor implements GPUTextureDescriptor {
    label?: string;
    size: GPUExtent3DStrict;
    mipLevelCount?: GPUIntegerCoordinate;
    sampleCount?: GPUSize32;
    dimension?: GPUTextureDimension;
    format: GPUTextureFormat;
    usage: GPUTextureUsageFlags;
}