import {RefObject} from "../asset/RefObject";
import {SamplerDescriptor} from "../webgpu/SamplerDescriptor";

/**
 * The base class of texture, contains some common functions of texture-related classes.
 */
export abstract class SamplerTexture extends RefObject {
    name: string;

    /** @internal */
    _platformTexture: GPUTexture;
    /** @internal */
    _platformTextureDesc: TextureDescriptor;
    /** @internal */
    _platformSampler: GPUSampler;
    /** @internal */
    _platformSamplerDesc: SamplerDescriptor;
    /** @internal */
    _mipmap: boolean;

    /**
     * The width of the texture.
     */
    get width(): number {
        return this._platformTextureDesc.size[0];
    }

    /**
     * The height of the texture.
     */
    get height(): number {
        return this._platformTextureDesc.size[1];
    }

    /**
     * Wrapping mode for texture coordinate S.
     */
    get wrapModeU(): GPUAddressMode {
        return this._platformSamplerDesc.addressModeU;
    }

    set wrapModeU(value: GPUAddressMode) {
        if (value === this._platformSamplerDesc.addressModeU) return;
        this._platformSamplerDesc.addressModeU = value;
    }

    /**
     * Wrapping mode for texture coordinate T.
     */
    get wrapModeV(): GPUAddressMode {
        return this._platformSamplerDesc.addressModeV;
    }

    set wrapModeV(value: GPUAddressMode) {
        if (value === this._platformSamplerDesc.addressModeV) return;
        this._platformSamplerDesc.addressModeV = value;
    }

    /**
     * Texture mipmapping count.
     */
    get mipmapCount(): number {
        return this._platformTextureDesc.mipLevelCount;
    }

    /**
     * Filter mode for texture.
     */
    get minFilterMode(): GPUFilterMode {
        return this._platformSamplerDesc.minFilter;
    }

    set minFilterMode(value: GPUFilterMode) {
        if (value === this._platformSamplerDesc.minFilter) return;
        this._platformSamplerDesc.minFilter = value;
    }

    /**
     * Filter mode for texture.
     */
    get magFilterMode(): GPUFilterMode {
        return this._platformSamplerDesc.magFilter;
    }

    set magFilterMode(value: GPUFilterMode) {
        if (value === this._platformSamplerDesc.magFilter) return;
        this._platformSamplerDesc.magFilter = value;
    }

    /**
     * Anisotropic level for texture.
     */
    get anisoLevel(): number {
        return this._platformSamplerDesc.maxAnisotropy;
    }

    set anisoLevel(value: number) {
        if (value === this._platformSamplerDesc.maxAnisotropy) return;
        this._platformSamplerDesc.maxAnisotropy = value;
    }

    /**
     * @override
     */
    _onDestroy() {
        this._platformTexture.destroy();
        this._platformTexture = null;
    }

    /**
     * Get the maximum mip level of the corresponding size:rounding down.
     * @remarks http://download.nvidia.com/developer/Papers/2005/NP2_Mipmapping/NP2_Mipmap_Creation.pdf
     */
    protected _getMaxMiplevel(size: number): number {
        return Math.floor(Math.log2(size));
    }

    protected _getMipmapCount(): number {
        return this._mipmap ? Math.floor(Math.log2(Math.max(this._platformTextureDesc.size[0], this._platformTextureDesc.size[1]))) + 1 : 1;
    }
}