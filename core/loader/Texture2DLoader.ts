import {AssetPromise, LoadItem, Loader, AssetType, resourceLoader, ResourceManager} from "../asset";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";
import {imageBitmapOptions} from "./Image";

@resourceLoader(AssetType.Texture2D, ["png", "jpg", "webp", "jpeg"])
class Texture2DLoader extends Loader<SamplerTexture2D> {
    private static _imageBitmapOptions = new imageBitmapOptions();

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

                    const imageBitmapOptions = Texture2DLoader._imageBitmapOptions;
                    const levelCount = Math.max(Math.log2(image.width) + 1, Math.log2(image.height) + 1);
                    for (let level = 0; level < levelCount; level++) {
                        imageBitmapOptions.resizeWidth = Math.max(1, image.width / Math.pow(2, level));
                        imageBitmapOptions.resizeHeight = Math.max(1, image.height / Math.pow(2, level));
                        createImageBitmap(image, imageBitmapOptions).then((value => {
                            texture.setImageSource(value, level);
                        }))
                    }

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
