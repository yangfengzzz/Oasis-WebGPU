import {Color, Vector4} from "@oasis-engine/math";
import {Shader} from "../shader";
import {BaseMaterial} from "./BaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";
import {Engine} from "../Engine";

/**
 * Unlit Material.
 */
export class UnlitMaterial extends BaseMaterial {
    private static _baseColorProp = Shader.getPropertyByName("u_baseColor");
    private static _baseTextureProp = Shader.getPropertyByName("u_baseTexture");
    private static _tilingOffsetProp = Shader.getPropertyByName("u_tilingOffset");

    private _baseColor = new Color(1, 1, 1, 1);
    private _baseTexture: SamplerTexture2D;
    private _tilingOffset = new Vector4(1, 1, 0, 0);

    /**
     * Base color.
     */
    get baseColor(): Color {
        return this._baseColor;
    }

    set baseColor(value: Color) {
        const baseColor = this._baseColor;
        if (value !== baseColor) {
            value.cloneTo(baseColor);
        }
        this.shaderData.setColor(UnlitMaterial._baseColorProp, baseColor);
    }

    /**
     * Base texture.
     */
    get baseTexture(): SamplerTexture2D {
        return this._baseTexture;
    }

    set baseTexture(value: SamplerTexture2D) {
        this._baseTexture = value;
        this.shaderData.setTexture(UnlitMaterial._baseTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_BASE_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_BASE_TEXTURE");
        }
    }

    /**
     * Tiling and offset of main textures.
     */
    get tilingOffset(): Vector4 {
        return this._tilingOffset;
    }

    set tilingOffset(value: Vector4) {
        const tilingOffset = this._tilingOffset;
        if (value !== tilingOffset) {
            value.cloneTo(tilingOffset);
        }
        this.shaderData.setVector4(UnlitMaterial._tilingOffsetProp, tilingOffset);
    }

    /**
     * Create a unlit material instance.
     * @param engine - Engine to which the material belongs
     */
    constructor(engine: Engine) {
        super(engine, Shader.find("unlit"));

        const shaderData = this.shaderData;

        shaderData.enableMacro("OMIT_NORMAL");
        shaderData.enableMacro("O3_NEED_TILINGOFFSET");

        shaderData.setColor(UnlitMaterial._baseColorProp, new Color(1, 1, 1, 1));
        shaderData.setVector4(UnlitMaterial._tilingOffsetProp, new Vector4(1, 1, 0, 0));
    }

    /**
     * @override
     */
    clone(): UnlitMaterial {
        const dest = new UnlitMaterial(this._engine);
        this.cloneTo(dest);
        return dest;
    }
}
