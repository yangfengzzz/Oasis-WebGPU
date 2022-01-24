class TextureDescriptor implements GPUTextureDescriptor {
    dimension: GPUTextureDimension;
    format: GPUTextureFormat;
    label: string;
    mipLevelCount: GPUIntegerCoordinate;
    sampleCount: GPUSize32;
    size: GPUExtent3DStrict;
    usage: GPUTextureUsageFlags;
}