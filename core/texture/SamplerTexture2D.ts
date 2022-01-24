import {SamplerTexture} from "./SamplerTexture";
import {Engine} from "../Engine";

/**
 * Two-dimensional texture.
 */
export class SamplerTexture2D extends SamplerTexture {
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
     * @param mipmap - Whether to use multi-level texture
     */
    constructor(
        engine: Engine,
        width: number,
        height: number,
        format: GPUTextureFormat = 'rgba8sint',
        mipmap: boolean = true
    ) {
        super(engine);
        this._mipmap = mipmap;
        this._platformTextureDesc.size[0] = width;
        this._platformTextureDesc.size[1] = height;
        this._platformTextureDesc.format = format;
        this._platformTextureDesc.mipLevelCount = this._getMipmapCount();
        this.minFilterMode = this.magFilterMode = 'linear';
        this.wrapModeU = this.wrapModeV = 'repeat';
    }
}