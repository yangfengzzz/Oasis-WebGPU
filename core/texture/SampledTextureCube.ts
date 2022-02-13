import {SampledTexture} from "./SampledTexture";
import {Engine} from "../Engine";
import {SampledTexture2DView} from "./SampledTexture2DView";
import {
    BufferDescriptor,
    Extent3DDict,
    Extent3DDictStrict,
    ImageCopyExternalImage,
    ImageCopyTextureTagged,
    TextureViewDescriptor
} from "../webgpu";
import {TextureCubeFace} from "./enums/TextureCubeFace";

export class SampledTextureCube extends SampledTexture {
    private static _textureViewDescriptor: TextureViewDescriptor = new TextureViewDescriptor();
    private static _imageCopyExternalImage: ImageCopyExternalImage = new ImageCopyExternalImage();
    private static _imageCopyTextureTagged = new ImageCopyTextureTagged();
    private static _extent3DDictStrict = new Extent3DDictStrict();
    private static _bufferDescriptor = new BufferDescriptor();

    /**
     * Create TextureCube.
     * @param engine - Define the engine to use to render this texture
     * @param width - Texture width
     * @param height - Texture height
     * @param format - Texture format. default  `TextureFormat.R8G8B8A8`
     * @param usage - Texture usage. default  `TEXTURE_BINDING | COPY_DST`
     * @param mipmap - Whether to use multi-level texture
     */
    constructor(
        engine: Engine,
        width: number = 0,
        height: number = 0,
        format: GPUTextureFormat = 'rgba8unorm',
        usage: GPUTextureUsageFlags = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        mipmap: boolean = true
    ) {
        super(engine);
        const textureDesc = this._platformTextureDesc;
        textureDesc.size = new Extent3DDict();
        textureDesc.size.width = width;
        textureDesc.size.height = height;
        textureDesc.size.depthOrArrayLayers = 6;
        textureDesc.format = format;
        textureDesc.usage = usage;
        textureDesc.mipLevelCount = this._getMipmapCount(mipmap);
        this._platformTexture = engine.device.createTexture(textureDesc);
    }

    get textureView(): GPUTextureView {
        const textureViewDescriptor = SampledTextureCube._textureViewDescriptor;
        const platformTextureDesc = this._platformTextureDesc;
        textureViewDescriptor.format = platformTextureDesc.format;
        textureViewDescriptor.dimension = 'cube';
        textureViewDescriptor.mipLevelCount = platformTextureDesc.mipLevelCount;
        textureViewDescriptor.arrayLayerCount = platformTextureDesc.size.depthOrArrayLayers;
        textureViewDescriptor.aspect = 'all';
        return this._platformTexture.createView(textureViewDescriptor);
    }

    textureView2D(mipmapLevel: number, layer: number): SampledTexture2DView {
        return new SampledTexture2DView(this.engine, () => {
            const textureViewDescriptor = new TextureViewDescriptor();
            textureViewDescriptor.dimension = '2d';
            textureViewDescriptor.format = this._platformTextureDesc.format;
            textureViewDescriptor.baseMipLevel = mipmapLevel;
            textureViewDescriptor.mipLevelCount = 1;
            textureViewDescriptor.baseArrayLayer = layer;
            textureViewDescriptor.arrayLayerCount = 1;
            textureViewDescriptor.aspect = 'all';
            return this._platformTexture.createView(textureViewDescriptor);
        });
    }

    /**
     * Setting pixels data through cube face, TexImageSource, designated area and texture mipmapping level.
     * @param face - Cube face
     * @param imageSource - The source of texture
     * @param mipLevel - Texture mipmapping level
     * @param premultiplyAlpha - Whether to premultiply the transparent channel
     * @param x - X coordinate of area start
     * @param y - Y coordinate of area start
     */
    setImageSource(
        face: TextureCubeFace,
        imageSource: ImageBitmap | HTMLCanvasElement | OffscreenCanvas,
        mipLevel: number = 0,
        premultiplyAlpha: boolean = false,
        x: number = 0,
        y: number = 0
    ): void {
        const imageCopyExternalImage = SampledTextureCube._imageCopyExternalImage;
        imageCopyExternalImage.source = imageSource;
        imageCopyExternalImage.origin = [x, y];

        const imageCopyTextureTagged = SampledTextureCube._imageCopyTextureTagged;
        imageCopyTextureTagged.texture = this._platformTexture;
        imageCopyTextureTagged.aspect = 'all'
        imageCopyTextureTagged.mipLevel = mipLevel;
        imageCopyTextureTagged.origin = [x, y, face];
        imageCopyTextureTagged.premultipliedAlpha = premultiplyAlpha;

        const extent3DDictStrict = SampledTextureCube._extent3DDictStrict;
        const size = this._platformTextureDesc.size;
        extent3DDictStrict.width = Math.max(1, size.width / Math.pow(2, mipLevel));
        extent3DDictStrict.height = Math.max(1, size.height / Math.pow(2, mipLevel));

        this._engine.device.queue.copyExternalImageToTexture(imageCopyExternalImage, imageCopyTextureTagged, extent3DDictStrict)
    }

}
