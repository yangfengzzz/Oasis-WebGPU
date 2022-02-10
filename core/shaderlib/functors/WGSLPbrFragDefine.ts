import {WGSLEncoder} from "../WGSLEncoder";
import {SamplerType, TextureType, UniformType} from "../WGSLCommon";
import {ShaderMacroCollection} from "../../shader/ShaderMacroCollection";

export class WGSLPbrFragDefine {
    private readonly _outputStructName: string;
    private readonly _is_metallic_workflow: boolean;
    private readonly _pbrStruct: string;

    constructor(outputStructName: string, is_metallic_workflow: boolean) {
        this._outputStructName = outputStructName;
        this._is_metallic_workflow = is_metallic_workflow;
        this._pbrStruct = "struct PbrBaseData {\n";
        this._pbrStruct += "  baseColor : vec4<f32>;\n";
        this._pbrStruct += "  emissiveColor : vec4<f32>;\n";
        this._pbrStruct += "  normalTextureIntensity : f32;\n";
        this._pbrStruct += "  occlusionTextureIntensity : f32;\n";
        this._pbrStruct += "};\n";

        if (this._is_metallic_workflow) {
            this._pbrStruct += "struct PbrData {\n";
            this._pbrStruct += "  metallic : f32;\n";
            this._pbrStruct += "  roughness : f32;\n";
            this._pbrStruct += "};\n";
        } else {
            this._pbrStruct += "struct PbrSpecularData {\n";
            this._pbrStruct += "  specularColor : vec4<f32>;\n";
            this._pbrStruct += "  glossiness : f32;\n";
            this._pbrStruct += "};\n";
        }
    }

    execute(encoder: WGSLEncoder, macros: ShaderMacroCollection, counterIndex: number) {
        encoder.addUniformBinding("u_alphaCutoff", UniformType.F32, 0);
        encoder.addStruct(this._pbrStruct);
        encoder.addUniformBinding("u_pbrBaseData", "PbrBaseData", 0);
        if (this._is_metallic_workflow) {
            encoder.addUniformBinding("u_pbrData", "PbrData", 0);
        } else {
            encoder.addUniformBinding("u_pbrSpecularData", "PbrSpecularData", 0);
        }

        if (macros.isEnable("HAS_BASE_COLORMAP")) {
            encoder.addSampledTextureBinding("u_baseColorTexture", TextureType.Texture2Df32,
                "u_baseColorSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_NORMAL_TEXTURE")) {
            encoder.addSampledTextureBinding("u_normalTexture", TextureType.Texture2Df32,
                "u_normalSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_EMISSIVE_TEXTURE")) {
            encoder.addSampledTextureBinding("u_emissiveTexture", TextureType.Texture2Df32,
                "u_emissiveSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_METALROUGHNESSMAP") && this._is_metallic_workflow) {
            encoder.addSampledTextureBinding("u_metallicRoughnessTexture", TextureType.Texture2Df32,
                "u_metallicRoughnessSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_SPECULARGLOSSINESSMAP") && !this._is_metallic_workflow) {
            encoder.addSampledTextureBinding("u_specularGlossinessTexture", TextureType.Texture2Df32,
                "u_specularGlossinessSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_OCCLUSIONMAP")) {
            encoder.addSampledTextureBinding("u_occlusionTexture", TextureType.Texture2Df32,
                "u_occlusionSampler", SamplerType.Sampler);
        }

        let structType = "struct ReflectedLight {\n";
        structType += "    directDiffuse: vec3<f32>;\n";
        structType += "    directSpecular: vec3<f32>;\n";
        structType += "    indirectDiffuse: vec3<f32>;\n";
        structType += "    indirectSpecular: vec3<f32>;\n";
        structType += "};\n";
        encoder.addStruct(structType);

        structType = "struct GeometricContext {\n";
        structType += "    position: vec3<f32>;\n";
        structType += "    normal: vec3<f32>;\n";
        structType += "    viewDir: vec3<f32>;\n";
        structType += "};\n";
        encoder.addStruct(structType);

        structType = "struct PhysicalMaterial {\n";
        structType += "    diffuseColor: vec3<f32>;\n";
        structType += "    roughness: f32;\n";
        structType += "    specularColor: vec3<f32>;\n";
        structType += "    opacity: f32;\n";
        structType += "};\n";
        encoder.addStruct(structType);
    }
}
