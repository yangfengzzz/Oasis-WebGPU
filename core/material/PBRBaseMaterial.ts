import {Color} from "@oasis-engine/math";
import {Engine} from "../Engine";
import {Shader} from "../shader";
import {BaseMaterial} from "./BaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

/**
 * PBR (Physically-Based Rendering) Material.
 */
export abstract class PBRBaseMaterial extends BaseMaterial {
    private static _pbrBaseProp = Shader.getPropertyByName("u_pbrBaseData");
    private static _baseTextureProp = Shader.getPropertyByName("u_baseColorTexture");
    private static _baseSamplerProp = Shader.getPropertyByName("u_baseColorSampler");
    private static _normalTextureProp = Shader.getPropertyByName("u_normalTexture");
    private static _normalSamplerProp = Shader.getPropertyByName("u_normalSampler");
    private static _emissiveTextureProp = Shader.getPropertyByName("u_emissiveTexture");
    private static _emissiveSamplerProp = Shader.getPropertyByName("u_emissiveSampler");
    private static _occlusionTextureProp = Shader.getPropertyByName("u_occlusionTexture");
    private static _occlusionSamplerProp = Shader.getPropertyByName("u_occlusionSampler");

    // baseColor, emissiveColor, normalTextureIntensity, occlusionTextureIntensity
    private _pbrBaseData: Float32Array = new Float32Array(12);
    private _baseTexture: SamplerTexture2D;
    private _normalTexture: SamplerTexture2D;
    private _emissiveTexture: SamplerTexture2D;
    private _occlusionTexture: SamplerTexture2D;

    /**
     * Base color.
     */
    baseColor(color: Color): Color {
        const pbrBaseData = this._pbrBaseData;
        color.setValue(pbrBaseData[0], pbrBaseData[1], pbrBaseData[2], pbrBaseData[3])
        return color;
    }

    setBaseColor(value: Color) {
        const pbrBaseData = this._pbrBaseData;
        pbrBaseData[0] = value.r;
        pbrBaseData[1] = value.g;
        pbrBaseData[2] = value.b;
        pbrBaseData[3] = value.a;
        this.shaderData.setFloatArray(PBRBaseMaterial._pbrBaseProp, pbrBaseData);
    }

    /**
     * Base texture.
     */
    get baseTexture(): SamplerTexture2D {
        return this._baseTexture;
    }

    set baseTexture(value: SamplerTexture2D) {
        this._baseTexture = value;
        this.shaderData.setSampledTexture(PBRBaseMaterial._baseTextureProp, PBRBaseMaterial._baseSamplerProp, value);
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
        this.shaderData.setSampledTexture(PBRBaseMaterial._normalTextureProp, PBRBaseMaterial._normalSamplerProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_NORMAL_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_NORMAL_TEXTURE");
        }
    }

    /**
     * Emissive color.
     */
    emissiveColor(color: Color): Color {
        const pbrBaseData = this._pbrBaseData;
        color.setValue(pbrBaseData[4], pbrBaseData[5], pbrBaseData[6], pbrBaseData[7])
        return color;
    }

    setEmissiveColor(value: Color) {
        const pbrBaseData = this._pbrBaseData;
        pbrBaseData[4] = value.r;
        pbrBaseData[5] = value.g;
        pbrBaseData[6] = value.b;
        pbrBaseData[7] = value.a;
        this.shaderData.setFloatArray(PBRBaseMaterial._pbrBaseProp, pbrBaseData);
    }

    /**
     * Normal texture intensity.
     */
    get normalTextureIntensity(): number {
        return this._pbrBaseData[8];
    }

    set normalTextureIntensity(value: number) {
        const pbrBaseData = this._pbrBaseData;
        pbrBaseData[8] = value;
        this.shaderData.setFloatArray(PBRBaseMaterial._pbrBaseProp, pbrBaseData);
    }

    /**
     * Emissive texture.
     */
    get emissiveTexture(): SamplerTexture2D {
        return this._emissiveTexture;
    }

    set emissiveTexture(value: SamplerTexture2D) {
        this._emissiveTexture = value;
        this.shaderData.setSampledTexture(PBRBaseMaterial._emissiveTextureProp, PBRBaseMaterial._emissiveSamplerProp, value);
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
        this.shaderData.setSampledTexture(PBRBaseMaterial._occlusionTextureProp, PBRBaseMaterial._occlusionSamplerProp, value);
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
        return this._pbrBaseData[9];
    }

    set occlusionTextureIntensity(value: number) {
        const pbrBaseData = this._pbrBaseData;
        pbrBaseData[9] = value;
        this.shaderData.setFloatArray(PBRBaseMaterial._pbrBaseProp, pbrBaseData);
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

        const pbrBaseData = this._pbrBaseData;
        // baseColor
        pbrBaseData[0] = 1;
        pbrBaseData[1] = 1;
        pbrBaseData[2] = 1;
        pbrBaseData[3] = 1;
        // emissiveColor
        pbrBaseData[4] = 0;
        pbrBaseData[5] = 0;
        pbrBaseData[6] = 0;
        pbrBaseData[7] = 1;
        // normalTextureIntensity
        pbrBaseData[8] = 1;
        // occlusionTextureIntensity
        pbrBaseData[9] = 1;
        // pad1, pad2
        pbrBaseData[10] = 0;
        pbrBaseData[11] = 0;
        shaderData.setFloatArray(PBRBaseMaterial._pbrBaseProp, pbrBaseData);
    }
}
