import {AssetPromise, LoadItem, Loader, AssetType, resourceLoader, ResourceManager} from "../asset";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

@resourceLoader(AssetType.Texture2D, ["png", "jpg", "webp", "jpeg"])
class Texture2DLoader extends Loader<SamplerTexture2D> {
    load(item: LoadItem, resourceManager: ResourceManager): AssetPromise<SamplerTexture2D> {
        return new AssetPromise((resolve, reject) => {
            this.request<HTMLImageElement>(item.url, {
                ...item,
                type: "image"
            })
                .then((image) => {
                    const texture = new SamplerTexture2D(resourceManager.engine, image.width, image.height);
                    /** @ts-ignore */
                    if (!texture._platformTexture) return;

                    createImageBitmap(image).then((value => {
                        texture.setImageSource(value);
                    }))
                    // texture.generateMipmaps();

                    if (item.url.indexOf("data:") !== 0) {
                        const splitPath = item.url.split("/");
                        texture.name = splitPath[splitPath.length - 1];
                    }
                    resolve(texture);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}
