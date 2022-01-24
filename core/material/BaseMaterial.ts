import {ShaderMacro} from "../shader/ShaderMacro";
import {Shader} from "../shader";
import {BlendMode} from "./enums/BlendMode";
import {Material} from "./Material";
import {RenderQueueType} from "./enums/RenderQueueType";
import {RenderFace} from "./enums/RenderFace";

export class BaseMaterial extends Material {
    private static _alphaCutoffMacro: ShaderMacro = Shader.getMacroByName("ALPHA_CUTOFF");
    private static _alphaCutoffProp = Shader.getPropertyByName("u_alphaCutoff");

    private _renderFace: RenderFace = RenderFace.Front;
    private _isTransparent: boolean = false;
    private _blendMode: BlendMode;

    /**
     * Is this material transparent.
     * @remarks
     * If material is transparent, transparent blend mode will be affected by `blendMode`, default is `BlendMode.Normal`.
     */
    get isTransparent(): boolean {
        return this._isTransparent;
    }

    set isTransparent(value: boolean) {
        if (value === this._isTransparent) return;
        this._isTransparent = value;

        const {
            depthState,
            blendState: {targetBlendState}
        } = this.renderState;

        if (value) {
            targetBlendState.enabled = true;
            depthState.writeEnabled = false;
            this.renderQueueType = RenderQueueType.Transparent;
        } else {
            targetBlendState.enabled = false;
            depthState.writeEnabled = true;
            this.renderQueueType = this.shaderData.getFloat(BaseMaterial._alphaCutoffProp)
                ? RenderQueueType.AlphaTest
                : RenderQueueType.Opaque;
        }
    }


    /**
     * Alpha cutoff value.
     * @remarks
     * Fragments with alpha channel lower than cutoff value will be discarded.
     * `0` means no fragment will be discarded.
     */
    get alphaCutoff(): number {
        return this.shaderData.getFloat(BaseMaterial._alphaCutoffProp);
    }

    set alphaCutoff(value: number) {
        this.shaderData.setFloat(BaseMaterial._alphaCutoffProp, value);

        if (value > 0) {
            this.shaderData.enableMacro(BaseMaterial._alphaCutoffMacro);
            this.renderQueueType = this._isTransparent ? RenderQueueType.Transparent : RenderQueueType.AlphaTest;
        } else {
            this.shaderData.disableMacro(BaseMaterial._alphaCutoffMacro);
            this.renderQueueType = this._isTransparent ? RenderQueueType.Transparent : RenderQueueType.Opaque;
        }
    }

    /**
     * Set which face for render.
     */
    get renderFace(): RenderFace {
        return this._renderFace;
    }

    set renderFace(value: RenderFace) {
        if (value === this._renderFace) return;
        this._renderFace = value;

        switch (value) {
            case RenderFace.Front:
                this.renderState.rasterState.cullMode = 'back';
                break;
            case RenderFace.Back:
                this.renderState.rasterState.cullMode = 'front';
                break;
            case RenderFace.Double:
                this.renderState.rasterState.cullMode = 'none';
                break;
        }
    }

    /**
     * Alpha blend mode.
     * @remarks
     * Only take effect when `isTransparent` is `true`.
     */
    get blendMode(): BlendMode {
        return this._blendMode;
    }

    set blendMode(value: BlendMode) {
        if (value === this._blendMode) return;
        this._blendMode = value;

        const {
            blendState: {targetBlendState: target}
        } = this.renderState;

        switch (value) {
            case BlendMode.Normal:
                target.sourceColorBlendFactor = 'src-alpha';
                target.destinationColorBlendFactor = 'one-minus-src-alpha';
                target.sourceAlphaBlendFactor = 'one';
                target.destinationAlphaBlendFactor = 'one-minus-src-alpha';
                target.colorBlendOperation = target.alphaBlendOperation = 'add';
                break;
            case BlendMode.Additive:
                target.sourceColorBlendFactor = 'src-alpha';
                target.destinationColorBlendFactor = 'one';
                target.sourceAlphaBlendFactor = 'one';
                target.destinationAlphaBlendFactor = 'one-minus-src-alpha';
                target.colorBlendOperation = target.alphaBlendOperation = 'add';
                break;
        }
    }

    /**
     * Create a BaseMaterial instance.
     * @param shader - Shader used by the material
     */
    constructor(shader: Shader) {
        super(shader);
        this.blendMode = BlendMode.Normal;
        this.shaderData.setFloat(BaseMaterial._alphaCutoffProp, 0);
    }
}