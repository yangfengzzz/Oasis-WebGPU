import {SamplerTexture} from "./SamplerTexture";
import {Engine} from "../Engine";
import {TextureViewDescriptor} from "../webgpu";
import {Extent3DDict} from "../webgpu";

/**
 * Two-dimensional texture.
 */
export class SamplerTexture2D extends SamplerTexture {
    private static _textureViewDescriptor: TextureViewDescriptor = new TextureViewDescriptor();

    /**
     * Texture format.
     */
    get format(): GPUTextureFormat {
        return this._platformTextureDesc.format;
    }

    /**
     * Create Texture2D.
     * @param engine - Define the engine to use to render this texture
     * @param width - Texture width
     * @param height - Texture height
     * @param format - Texture format. default  `TextureFormat.R8G8B8A8`
     * @param usage - Texture usage. default  `TEXTURE_BINDING | COPY_DST`
     * @param mipmap - Whether to use multi-level texture
     */
    constructor(
        engine: Engine,
        width: number,
        height: number,
        format: GPUTextureFormat = 'rgba8sint',
        usage: GPUTextureUsageFlags = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        mipmap: boolean = true
    ) {
        super(engine);
        const textureDesc = this._platformTextureDesc;
        textureDesc.size = new Extent3DDict();
        textureDesc.size.width = width;
        textureDesc.size.height = height;
        textureDesc.format = format;
        textureDesc.usage = usage;
        textureDesc.mipLevelCount = this._getMipmapCount(mipmap);
        this._platformTexture = engine.device.createTexture(textureDesc);
    }

    get textureView(): GPUTextureView {
        const textureViewDescriptor = SamplerTexture2D._textureViewDescriptor;
        const platformTextureDesc = this._platformTextureDesc;
        textureViewDescriptor.format = platformTextureDesc.format;
        textureViewDescriptor.dimension = '2d';
        textureViewDescriptor.mipLevelCount = platformTextureDesc.mipLevelCount;
        textureViewDescriptor.arrayLayerCount = platformTextureDesc.size.depthOrArrayLayers;
        textureViewDescriptor.aspect = 'all';
        return this._platformTexture.createView(textureViewDescriptor);
    }
}
