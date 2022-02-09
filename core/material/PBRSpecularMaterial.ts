import {Color} from "@oasis-engine/math";
import {Engine} from "../Engine";
import {Shader} from "../shader";
import {PBRBaseMaterial} from "./PBRBaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

/**
 * PBR (Specular-Glossiness Workflow) Material.
 */
export class PBRSpecularMaterial extends PBRBaseMaterial {
    private static _pbrSpecularProp = Shader.getPropertyByName("u_pbrSpecularData");
    private static _specularGlossinessTextureProp = Shader.getPropertyByName("u_specularGlossinessTexture");
    private static _specularGlossinessSamplerProp = Shader.getPropertyByName("u_specularGlossinessSampler");

    // specularColor, glossiness, _pad1, _pad2, _pad3
    private _pbrSpecularData: Float32Array = new Float32Array(8);
    private _specularGlossinessTexture: SamplerTexture2D;

    /**
     * Specular color.
     */
    specularColor(color:Color): Color {
        const pbrSpecularData = this._pbrSpecularData;
        color.setValue(pbrSpecularData[0], pbrSpecularData[1], pbrSpecularData[2], pbrSpecularData[3]);
        return color;
    }

    setSpecularColor(value: Color) {
        const pbrSpecularData = this._pbrSpecularData;
        pbrSpecularData[0] = value.r;
        pbrSpecularData[1] = value.g;
        pbrSpecularData[2] = value.b;
        pbrSpecularData[3] = value.a;
        this.shaderData.setFloatArray(PBRSpecularMaterial._pbrSpecularProp, pbrSpecularData);
    }

    /**
     * Glossiness.
     */
    get glossiness(): number {
        return this._pbrSpecularData[4];
    }

    set glossiness(value: number) {
        const pbrSpecularData = this._pbrSpecularData;
        pbrSpecularData[4] = value;
        this.shaderData.setFloatArray(PBRSpecularMaterial._pbrSpecularProp, pbrSpecularData);
    }

    /**
     * Specular glossiness texture.
     * @remarks RGB is specular, A is glossiness
     */
    get specularGlossinessTexture(): SamplerTexture2D {
        return this._specularGlossinessTexture;
    }

    set specularGlossinessTexture(value: SamplerTexture2D) {
        this._specularGlossinessTexture = value;
        this.shaderData.setSampledTexture(PBRSpecularMaterial._specularGlossinessTextureProp, PBRSpecularMaterial._specularGlossinessSamplerProp, value);
        if (value) {
            this.shaderData.enableMacro("HAS_SPECULARGLOSSINESSMAP");
        } else {
            this.shaderData.disableMacro("HAS_SPECULARGLOSSINESSMAP");
        }
    }

    /**
     * Create a pbr specular-glossiness workflow material instance.
     * @param engine - Engine to which the material belongs
     */
    constructor(engine: Engine) {
        super(engine, Shader.find("pbr-specular"));

        const pbrSpecularData = this._pbrSpecularData;
        // specularColor
        pbrSpecularData[0] = 1;
        pbrSpecularData[1] = 1;
        pbrSpecularData[2] = 1;
        pbrSpecularData[3] = 1;
        // glossiness
        pbrSpecularData[4] = 1;
        // pad1, pad2, pad3
        pbrSpecularData[5] = 0;
        pbrSpecularData[6] = 0;
        pbrSpecularData[7] = 0;
        this.shaderData.setFloatArray(PBRSpecularMaterial._pbrSpecularProp, pbrSpecularData);
    }

    /**
     * @override
     */
    clone(): PBRSpecularMaterial {
        const dest = new PBRSpecularMaterial(this._engine);
        this.cloneTo(dest);
        return dest;
    }
}
