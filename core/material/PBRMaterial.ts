import {Engine} from "../Engine";
import {Shader} from "../shader";
import {PBRBaseMaterial} from "./PBRBaseMaterial";
import {SamplerTexture2D} from "../texture/SamplerTexture2D";

/**
 * PBR (Metallic-Roughness Workflow) Material.
 */
export class PBRMaterial extends PBRBaseMaterial {
    private static _metallicProp = Shader.getPropertyByName("u_metal");
    private static _roughnessProp = Shader.getPropertyByName("u_roughness");
    private static _metallicRoughnessTextureProp = Shader.getPropertyByName("u_metallicRoughnessSampler");

    private _metallic: number = 1.0;
    private _roughness: number = 1.0;
    private _roughnessMetallicTexture: SamplerTexture2D;

    /**
     * Metallic.
     */
    get metallic(): number {
        return this._metallic;
    }

    set metallic(value: number) {
        this._metallic = value;
        this.shaderData.setFloat(PBRMaterial._metallicProp, value);
    }

    /**
     * Roughness.
     */
    get roughness(): number {
        return this._roughness;
    }

    set roughness(value: number) {
        this._roughness = value;
        this.shaderData.setFloat(PBRMaterial._roughnessProp, value);
    }

    /**
     * Roughness metallic texture.
     * @remarks G channel is roughness, B channel is metallic
     */
    get roughnessMetallicTexture(): SamplerTexture2D {
        return this._roughnessMetallicTexture;
    }

    set roughnessMetallicTexture(value: SamplerTexture2D) {
        this._roughnessMetallicTexture = value;
        this.shaderData.setTexture(PBRMaterial._metallicRoughnessTextureProp, value);
        if (value) {
            this.shaderData.enableMacro("HAS_METALROUGHNESSMAP");
        } else {
            this.shaderData.disableMacro("HAS_METALROUGHNESSMAP");
        }
    }

    /**
     * Create a pbr metallic-roughness workflow material instance.
     * @param engine - Engine to which the material belongs
     */
    constructor(engine: Engine) {
        super(engine, Shader.find("pbr"));
        this.shaderData.setFloat(PBRMaterial._metallicProp, 1.0);
        this.shaderData.setFloat(PBRMaterial._roughnessProp, 1.0);
    }

    /**
     * @override
     */
    clone(): PBRMaterial {
        const dest = new PBRMaterial(this._engine);
        this.cloneTo(dest);
        return dest;
    }
}
