import {ShaderData} from "../../shader";
import {WGSLEncoder} from "../WGSLEncoder";
import {SamplerType, TextureType, UniformType} from "../WGSLCommon";

export class WGSLMobileMaterialShare {
    private readonly _outputStructName: string;
    private _blinnPhongStruct: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
        this._blinnPhongStruct =
            "struct BlinnPhongData {\n" +
            "  baseColor : vec4<f32>;\n" +
            "  specularColor : vec4<f32>;\n" +
            "  emissiveColor : vec4<f32>;\n" +
            "  normalIntensity : f32;\n" +
            "  shininess : f32;\n" +
            "};\n";
    }

    execute(encoder: WGSLEncoder, macros: ShaderData, counterIndex: number) {
        encoder.addStruct(this._blinnPhongStruct);
        encoder.addUniformBinding("u_blinnPhongData", "BlinnPhongData", 0);

        encoder.addUniformBinding("u_alphaCutoff", UniformType.F32, 0);

        if (macros.isEnable("HAS_EMISSIVE_TEXTURE")) {
            encoder.addSampledTextureBinding("u_emissiveTexture", TextureType.Texture2Df32,
                "u_emissiveSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_DIFFUSE_TEXTURE")) {
            encoder.addSampledTextureBinding("u_diffuseTexture", TextureType.Texture2Df32,
                "u_diffuseSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_SPECULAR_TEXTURE")) {
            encoder.addSampledTextureBinding("u_specularTexture", TextureType.Texture2Df32,
                "u_specularSampler", SamplerType.Sampler);
        }

        if (macros.isEnable("HAS_NORMAL_TEXTURE")) {
            encoder.addSampledTextureBinding("u_normalTexture", TextureType.Texture2Df32,
                "u_normalSampler", SamplerType.Sampler);
        }
    }
}
