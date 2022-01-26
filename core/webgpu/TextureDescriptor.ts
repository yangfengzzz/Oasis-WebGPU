export class TextureDescriptor implements GPUTextureDescriptor {
    label?: string;
    size: Extent3DDict;
    mipLevelCount?: GPUIntegerCoordinate;
    sampleCount?: GPUSize32;
    dimension?: GPUTextureDimension;
    format: GPUTextureFormat;
    usage: GPUTextureUsageFlags;
}

export class Extent3DDict implements GPUExtent3DDict {
    depthOrArrayLayers?: GPUIntegerCoordinate;
    height?: GPUIntegerCoordinate;
    width: GPUIntegerCoordinate;
}

export class TextureViewDescriptor implements GPUTextureViewDescriptor {
    label?: string;
    format?: GPUTextureFormat;
    dimension?: GPUTextureViewDimension;
    aspect?: GPUTextureAspect;
    baseMipLevel?: GPUIntegerCoordinate;
    mipLevelCount?: GPUIntegerCoordinate;
    baseArrayLayer?: GPUIntegerCoordinate;
    arrayLayerCount?: GPUIntegerCoordinate;
}

export class ExternalTextureDescriptor implements GPUExternalTextureDescriptor {
    colorSpace?: GPUPredefinedColorSpace;
    label?: string;
    source: HTMLVideoElement;
}
