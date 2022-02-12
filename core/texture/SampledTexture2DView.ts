import {SamplerTexture2D} from "./SamplerTexture2D";
import {Engine} from "../Engine";

export class SampledTexture2DView extends SamplerTexture2D {
    private readonly _creator: () => GPUTextureView;

    constructor(engine: Engine, creator: () => GPUTextureView) {
        super(engine);
        this._creator = creator;
    }

    get textureView(): GPUTextureView {
        return this._creator();
    }
}
