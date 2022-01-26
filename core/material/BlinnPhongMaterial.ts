import {Color, Vector4} from "@oasis-engine/math";
import {Engine} from "../Engine";
import {Shader} from "../shader";
import {BaseMaterial} from "./BaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

/**
 * Blinn-phong Material.
 */
export class BlinnPhongMaterial extends BaseMaterial {
    private static _diffuseColorProp = Shader.getPropertyByName("u_diffuseColor");
    private static _specularColorProp = Shader.getPropertyByName("u_specularColor");
    private static _emissiveColorProp = Shader.getPropertyByName("u_emissiveColor");
    private static _tilingOffsetProp = Shader.getPropertyByName("u_tilingOffset");
    private static _shininessProp = Shader.getPropertyByName("u_shininess");
    private static _normalIntensityProp = Shader.getPropertyByName("u_normalIntensity");

    private static _baseTextureProp = Shader.getPropertyByName("u_diffuseTexture");
    private static _specularTextureProp = Shader.getPropertyByName("u_specularTexture");
    private static _emissiveTextureProp = Shader.getPropertyByName("u_emissiveTexture");
    private static _normalTextureProp = Shader.getPropertyByName("u_normalTexture");

    private _baseColor: Color = new Color(1, 1, 1, 1);
    private _baseTexture: SamplerTexture2D;
    private _specularColor: Color = new Color(1, 1, 1, 1);
    private _specularTexture: SamplerTexture2D;
    private _emissiveColor = new Color(0, 0, 0, 1);
    private _emissiveTexture: SamplerTexture2D;
    private _normalTexture: SamplerTexture2D;
    private _normalIntensity: number = 1;
    private _shininess: number = 16;
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
        this.shaderData.setColor(BlinnPhongMaterial._diffuseColorProp, baseColor);
    }

    /**
     * Base texture.
     */
    get baseTexture(): SamplerTexture2D {
        return this._baseTexture;
    }

    set baseTexture(value: SamplerTexture2D) {
        this._baseTexture = value;
        this.shaderData.setTexture(BlinnPhongMaterial._baseTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_DIFFUSE_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_DIFFUSE_TEXTURE");
        }
    }

    /**
     * Specular color.
     */
    get specularColor(): Color {
        return this._specularColor;
    }

    set specularColor(value: Color) {
        const specularColor = this._specularColor;
        if (value !== specularColor) {
            value.cloneTo(specularColor);
        }
        this.shaderData.setColor(BlinnPhongMaterial._specularColorProp, specularColor);
    }

    /**
     * Specular texture.
     */
    get specularTexture(): SamplerTexture2D {
        return this._specularTexture;
    }

    set specularTexture(value: SamplerTexture2D) {
        this._specularTexture = value;
        this.shaderData.setTexture(BlinnPhongMaterial._specularTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_SPECULAR_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_SPECULAR_TEXTURE");
        }
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
        this.shaderData.setColor(BlinnPhongMaterial._emissiveColorProp, emissiveColor);
    }

    /**
     * Emissive texture.
     */
    get emissiveTexture(): SamplerTexture2D {
        return this._emissiveTexture;
    }

    set emissiveTexture(value: SamplerTexture2D) {
        this._emissiveTexture = value;
        this.shaderData.setTexture(BlinnPhongMaterial._emissiveTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_EMISSIVE_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_EMISSIVE_TEXTURE");
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
        this.shaderData.setTexture(BlinnPhongMaterial._normalTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("O3_NORMAL_TEXTURE");
        } else {
            this.shaderData.disableMacro("O3_NORMAL_TEXTURE");
        }
    }

    /**
     * Normal texture intensity.
     */
    get normalIntensity(): number {
        return this._normalIntensity;
    }

    set normalIntensity(value: number) {
        this._normalIntensity = value;
        this.shaderData.setFloat(BlinnPhongMaterial._normalIntensityProp, value);
    }

    /**
     * Set the specular reflection coefficient, the larger the value, the more convergent the specular reflection effect.
     */
    get shininess(): number {
        return this._shininess;
    }

    set shininess(value: number) {
        this._shininess = value;
        this.shaderData.setFloat(BlinnPhongMaterial._shininessProp, value);
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
        this.shaderData.setVector4(BlinnPhongMaterial._tilingOffsetProp, tilingOffset);
    }

    constructor(engine: Engine) {
        super(engine, Shader.find("blinn-phong"));

        const shaderData = this.shaderData;

        shaderData.enableMacro("O3_NEED_WORLDPOS");
        shaderData.enableMacro("O3_NEED_TILINGOFFSET");

        shaderData.setColor(BlinnPhongMaterial._diffuseColorProp, new Color(1, 1, 1, 1));
        shaderData.setColor(BlinnPhongMaterial._specularColorProp, new Color(1, 1, 1, 1));
        shaderData.setColor(BlinnPhongMaterial._emissiveColorProp, new Color(0, 0, 0, 1));
        shaderData.setVector4(BlinnPhongMaterial._tilingOffsetProp, new Vector4(1, 1, 0, 0));
        shaderData.setFloat(BlinnPhongMaterial._shininessProp, 16);
        shaderData.setFloat(BlinnPhongMaterial._normalIntensityProp, 1);
    }

    /**
     * @override
     */
    clone(): BlinnPhongMaterial {
        var dest: BlinnPhongMaterial = new BlinnPhongMaterial(this._engine);
        this.cloneTo(dest);
        return dest;
    }
}
