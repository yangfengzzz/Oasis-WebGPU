import {Color, Vector4} from "@oasis-engine/math";
import {Engine} from "../Engine";
import {Shader} from "../shader";
import {BaseMaterial} from "./BaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

/**
 * PBR (Physically-Based Rendering) Material.
 */
export abstract class PBRBaseMaterial extends BaseMaterial {
    private static _baseColorProp = Shader.getPropertyByName("u_baseColor");
    private static _emissiveColorProp = Shader.getPropertyByName("u_emissiveColor");
    private static _tilingOffsetProp = Shader.getPropertyByName("u_tilingOffset");
    private static _baseTextureProp = Shader.getPropertyByName("u_baseColorSampler");
    private static _normalTextureProp = Shader.getPropertyByName("u_normalTexture");
    private static _normalTextureIntensityProp = Shader.getPropertyByName("u_normalIntensity");
    private static _occlusionTextureIntensityProp = Shader.getPropertyByName("u_occlusionStrength");

    private static _emissiveTextureProp = Shader.getPropertyByName("u_emissiveSampler");
    private static _occlusionTextureProp = Shader.getPropertyByName("u_occlusionSampler");

    private _baseColor = new Color(1, 1, 1, 1);
    private _baseTexture: SamplerTexture2D;
    private _normalTexture: SamplerTexture2D;
    private _normalTextureIntensity: number = 1;
    private _emissiveColor = new Color(0, 0, 0, 1);
    private _emissiveTexture: SamplerTexture2D;
    private _occlusionTexture: SamplerTexture2D;
    private _occlusionTextureIntensity: number = 1;
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
        this.shaderData.setColor(PBRBaseMaterial._baseColorProp, baseColor);
    }

    /**
     * Base texture.
     */
    get baseTexture(): SamplerTexture2D {
        return this._baseTexture;
    }

    set baseTexture(value: SamplerTexture2D) {
        this._baseTexture = value;
        this.shaderData.setTexture(PBRBaseMaterial._baseTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("HAS_BASECOLORMAP");
        } else {
            this.shaderData.disableMacro("HAS_BASECOLORMAP");
        }
    }

    /**
     * Normal texture.
     */
    get normalTexture(): SamplerTexture2D {
        return this._normalTexture;
    }

    set normalTexture(value: SamplerTexture2D) {
        this._normalTexture = value;
        this.shaderData.setTexture(PBRBaseMaterial._normalTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_NORMAL_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_NORMAL_TEXTURE");
        }
    }

    /**
     * Normal texture intensity.
     */
    get normalTextureIntensity(): number {
        return this._normalTextureIntensity;
    }

    set normalTextureIntensity(value: number) {
        this._normalTextureIntensity = value;
        this.shaderData.setFloat(PBRBaseMaterial._normalTextureIntensityProp, value);
        this.shaderData.setFloat("u_normalIntensity", value);
    }

    /**
     * Emissive color.
     */
    get emissiveColor(): Color {
        return this._emissiveColor;
    }

    set emissiveColor(value: Color) {
        const emissiveColor = this._emissiveColor;
        if (value !== emissiveColor) {
            value.cloneTo(emissiveColor);
        }
        this.shaderData.setColor(PBRBaseMaterial._emissiveColorProp, emissiveColor);
    }

    /**
     * Emissive texture.
     */
    get emissiveTexture(): SamplerTexture2D {
        return this._emissiveTexture;
    }

    set emissiveTexture(value: SamplerTexture2D) {
        this._emissiveTexture = value;
        this.shaderData.setTexture(PBRBaseMaterial._emissiveTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("HAS_EMISSIVEMAP");
        } else {
            this.shaderData.disableMacro("HAS_EMISSIVEMAP");
        }
    }

    /**
     * Occlusion texture.
     */
    get occlusionTexture(): SamplerTexture2D {
        return this._occlusionTexture;
    }

    set occlusionTexture(value: SamplerTexture2D) {
        this._occlusionTexture = value;
        this.shaderData.setTexture(PBRBaseMaterial._occlusionTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("HAS_OCCLUSIONMAP");
        } else {
            this.shaderData.disableMacro("HAS_OCCLUSIONMAP");
        }
    }

    /**
     * Occlusion texture intensity.
     */
    get occlusionTextureIntensity(): number {
        return this._occlusionTextureIntensity;
    }

    set occlusionTextureIntensity(value: number) {
        this._occlusionTextureIntensity = value;
        this.shaderData.setFloat(PBRBaseMaterial._occlusionTextureIntensityProp, value);
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
        this.shaderData.setVector4(PBRBaseMaterial._tilingOffsetProp, tilingOffset);
    }

    /**
     * Create a pbr base material instance.
     * @param engine - Engine to which the material belongs
     * @param shader - Shader used by the material
     */
    protected constructor(engine: Engine, shader: Shader) {
        super(engine, shader);

        const shaderData = this.shaderData;

        shaderData.enableMacro("O3_NEED_WORLDPOS");
        shaderData.enableMacro("O3_NEED_TILINGOFFSET");

        shaderData.setColor(PBRBaseMaterial._baseColorProp, new Color(1, 1, 1, 1));
        shaderData.setColor(PBRBaseMaterial._emissiveColorProp, new Color(0, 0, 0, 1));
        shaderData.setVector4(PBRBaseMaterial._tilingOffsetProp, new Vector4(1, 1, 0, 0));

        shaderData.setFloat(PBRBaseMaterial._normalTextureIntensityProp, 1);
        shaderData.setFloat(PBRBaseMaterial._occlusionTextureIntensityProp, 1);
    }
}
