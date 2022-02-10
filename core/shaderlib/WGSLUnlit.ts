import {BindGroupInfo, WGSL} from "./WGSL";
import {ShaderMacroCollection} from "../shader/ShaderMacroCollection";
import {
    WGSLBeginPositionVert, WGSLBlendShapeInput,
    WGSLBlendShapeVert, WGSLCommon, WGSLCommonVert,
    WGSLPositionVert,
    WGSLSkinningVert,
    WGSLUVShare,
    WGSLUVVert
} from "./functors";
import {WGSLEncoder} from "./WGSLEncoder";
import {BuiltInType, SamplerType, TextureType, UniformType} from "./WGSLCommon";

export class WGSLUnlitVertex extends WGSL {
    private _commonVert: WGSLCommonVert;
    private _blendShapeInput: WGSLBlendShapeInput;
    private _uvShare: WGSLUVShare;
    private _beginPositionVert: WGSLBeginPositionVert;
    private _blendShapeVert: WGSLBlendShapeVert;
    private _skinningVert: WGSLSkinningVert;
    private _uvVert: WGSLUVVert;
    private _positionVert: WGSLPositionVert;

    private _macros: ShaderMacroCollection;

    constructor() {
        super();
        this._commonVert = new WGSLCommonVert("VertexIn");
        this._blendShapeInput = new WGSLBlendShapeInput("VertexIn");
        this._uvShare = new WGSLUVShare("VertexOut");
        this._beginPositionVert = new WGSLBeginPositionVert("in", "out");
        this._blendShapeVert = new WGSLBlendShapeVert("in", "out");
        this._skinningVert = new WGSLSkinningVert("in", "out");
        this._uvVert = new WGSLUVVert("in", "out");
        this._positionVert = new WGSLPositionVert("in", "out");
    }

    entry(): string {
        const macros = this._macros;

        let source: string = "";
        source += this._beginPositionVert.execute(macros);
        source += this._blendShapeVert.execute(macros);
        source += this._skinningVert.execute(macros);
        source += this._uvVert.execute(macros);
        source += this._positionVert.execute(macros);
        return source;
    }

    compile(macros: ShaderMacroCollection): [string, BindGroupInfo] {
        this._source = "";
        this._bindGroupInfo.clear();
        const inputStructCounter = WGSLEncoder.startCounter();
        const outputStructCounter = WGSLEncoder.startCounter(0);
        {
            const encoder = this.createSourceEncoder(GPUShaderStage.VERTEX);
            this._commonVert.execute(encoder, macros);
            this._blendShapeInput.execute(encoder, macros, inputStructCounter);
            this._uvShare.execute(encoder, macros, outputStructCounter);
            encoder.addInoutType("VertexOut", BuiltInType.Position, "position", UniformType.Vec4f32);

            this._macros = macros;
            encoder.addEntry([["in", "VertexIn"]], ["out", "VertexOut"], this.entry);
            encoder.flush();
        }
        WGSLEncoder.endCounter(inputStructCounter);
        WGSLEncoder.endCounter(outputStructCounter);
        return [this._source, this._bindGroupInfo];
    }
}

export class WGSLUnlitFragment extends WGSL {
    private _common: WGSLCommon;
    private _uvShare: WGSLUVShare;

    private _macros: ShaderMacroCollection;

    constructor() {
        super();
        this._common = new WGSLCommon();
        this._uvShare = new WGSLUVShare("VertexOut");
    }

    entry(): string {
        const macros = this._macros;

        let source: string = "";
        source += "var baseColor = u_baseColor;\n";
        if (macros.isEnable("HAS_BASE_TEXTURE")) {
            source += "var textureColor = textureSample(u_baseTexture, u_baseSampler, in.v_uv);\n";
            source += "baseColor = baseColor * textureColor;\n";
        }
        if (macros.isEnable("NEED_ALPHA_CUTOFF")) {
            source += "if( baseColor.a < u_alphaCutoff ) {\n";
            source += "    discard;\n";
            source += "}\n";
        }
        source += "out.finalColor = baseColor;\n";
        return source;
    }

    compile(macros: ShaderMacroCollection): [string, BindGroupInfo] {
        this._source = "";
        this._bindGroupInfo.clear();
        const inputStructCounter = WGSLEncoder.startCounter(0);
        {
            const encoder = this.createSourceEncoder(GPUShaderStage.FRAGMENT);
            this._common.execute(encoder, macros);
            this._uvShare.execute(encoder, macros, inputStructCounter);
            encoder.addUniformBinding("u_baseColor", UniformType.Vec4f32, 0);
            encoder.addUniformBinding("u_alphaCutoff", UniformType.F32, 0);
            encoder.addInoutType("Output", 0, "finalColor", UniformType.Vec4f32);
            if (macros.isEnable("HAS_BASE_TEXTURE")) {
                encoder.addSampledTextureBinding("u_baseTexture", TextureType.Texture2Df32, "u_baseSampler", SamplerType.Sampler);
            }

            this._macros = macros;
            encoder.addEntry([["in", "VertexOut"]], ["out", "Output"], this.entry);
            encoder.flush();
        }
        WGSLEncoder.endCounter(inputStructCounter);
        return [this._source, this._bindGroupInfo];
    }
}
