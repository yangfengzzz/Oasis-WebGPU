import {BindGroupInfo, WGSL} from "./WGSL";
import {ShaderMacroCollection} from "../shader/ShaderMacroCollection";
import {
    WGSLBeginMobileFrag,
    WGSLBeginNormalVert,
    WGSLBeginPositionVert,
    WGSLBeginViewDirFrag,
    WGSLBlendShapeInput,
    WGSLBlendShapeVert,
    WGSLColorShare,
    WGSLColorVert,
    WGSLCommon,
    WGSLCommonFrag,
    WGSLCommonVert,
    WGSLLightFragDefine,
    WGSLMobileBlinnphongFrag,
    WGSLMobileMaterialShare,
    WGSLNormalGet,
    WGSLNormalShare,
    WGSLNormalVert,
    WGSLPositionVert,
    WGSLSkinningVert,
    WGSLUVShare,
    WGSLUVVert,
    WGSLWorldPosShare,
    WGSLWorldPosVert
} from "./functors";
import {WGSLEncoder} from "./WGSLEncoder";
import {BuiltInType, UniformType} from "./WGSLCommon";

export class WGSLBlinnPhongVertex extends WGSL {
    private _common: WGSLCommon;
    private _commonVert: WGSLCommonVert;
    private _blendShapeInput: WGSLBlendShapeInput;
    private _uvShare: WGSLUVShare;
    private _colorShare: WGSLColorShare;
    private _normalShare: WGSLNormalShare;
    private _worldPosShare: WGSLWorldPosShare;

    private _beginPositionVert: WGSLBeginPositionVert;
    private _beginNormalVert: WGSLBeginNormalVert;
    private _blendShapeVert: WGSLBlendShapeVert;
    private _skinningVert: WGSLSkinningVert;
    private _uvVert: WGSLUVVert;
    private _colorVert: WGSLColorVert;
    private _normalVert: WGSLNormalVert;
    private _worldPosVert: WGSLWorldPosVert;
    private _positionVert: WGSLPositionVert;

    constructor() {
        super();
        this._common = new WGSLCommon();
        this._commonVert = new WGSLCommonVert("VertexIn");
        this._blendShapeInput = new WGSLBlendShapeInput("VertexIn");
        this._uvShare = new WGSLUVShare("VertexOut");
        this._colorShare = new WGSLColorShare("VertexOut");
        this._normalShare = new WGSLNormalShare("VertexOut");
        this._worldPosShare = new WGSLWorldPosShare("VertexOut");

        this._beginPositionVert = new WGSLBeginPositionVert("in", "out");
        this._beginNormalVert = new WGSLBeginNormalVert("in", "out");
        this._blendShapeVert = new WGSLBlendShapeVert("in", "out");
        this._skinningVert = new WGSLSkinningVert("in", "out");
        this._uvVert = new WGSLUVVert("in", "out");
        this._colorVert = new WGSLColorVert("in", "out");
        this._normalVert = new WGSLNormalVert("in", "out");
        this._worldPosVert = new WGSLWorldPosVert("in", "out");
        this._positionVert = new WGSLPositionVert("in", "out");
    }

    compile(macros: ShaderMacroCollection): [string, BindGroupInfo] {
        this._source = "";
        this._bindGroupInfo.clear();
        const inputStructCounter = WGSLEncoder.startCounter();
        const outputStructCounter = WGSLEncoder.startCounter(0);
        {
            const encoder = this.createSourceEncoder(GPUShaderStage.VERTEX);
            this._common.execute(encoder, macros);
            this._commonVert.execute(encoder, macros);
            this._blendShapeInput.execute(encoder, macros, inputStructCounter);
            this._uvShare.execute(encoder, macros, outputStructCounter);
            this._colorShare.execute(encoder, macros, outputStructCounter);
            this._normalShare.execute(encoder, macros, outputStructCounter);
            this._worldPosShare.execute(encoder, macros, outputStructCounter);
            encoder.addInoutType("VertexOut", BuiltInType.Position, "position", UniformType.Vec4f32);

            encoder.addEntry([["in", "VertexIn"]], ["out", "VertexOut"], (() => {
                let source: string = "";
                source += this._beginPositionVert.execute(macros);
                source += this._beginNormalVert.execute(macros);
                source += this._blendShapeVert.execute(macros);
                source += this._skinningVert.execute(macros);
                source += this._uvVert.execute(macros);
                source += this._colorVert.execute(macros);
                source += this._normalVert.execute(macros);
                source += this._worldPosVert.execute(macros);
                source += this._positionVert.execute(macros);
                return source;
            }));
            encoder.flush();
        }
        WGSLEncoder.endCounter(inputStructCounter);
        WGSLEncoder.endCounter(outputStructCounter);
        return [this._source, this._bindGroupInfo];
    }
}

export class WGSLBlinnPhongFragment extends WGSL {
    private _common: WGSLCommon;
    private _commonFrag: WGSLCommonFrag;
    private _uvShare: WGSLUVShare;
    private _colorShare: WGSLColorShare;
    private _normalShare: WGSLNormalShare;
    private _worldPosShare: WGSLWorldPosShare;
    private _lightFragDefine: WGSLLightFragDefine;
    private _mobileMaterialShare: WGSLMobileMaterialShare;
    private _normalGet: WGSLNormalGet;

    private _beginMobileFrag: WGSLBeginMobileFrag;
    private _beginViewDirFrag: WGSLBeginViewDirFrag;
    private _mobileBlinnphoneFrag: WGSLMobileBlinnphongFrag;

    constructor() {
        super();
        this._common = new WGSLCommon();
        this._commonFrag = new WGSLCommonFrag("VertexOut");
        this._uvShare = new WGSLUVShare("VertexOut");
        this._colorShare = new WGSLColorShare("VertexOut");
        this._normalShare = new WGSLNormalShare("VertexOut");
        this._worldPosShare = new WGSLWorldPosShare("VertexOut");
        this._lightFragDefine = new WGSLLightFragDefine("VertexOut");
        this._mobileMaterialShare = new WGSLMobileMaterialShare("VertexOut");
        this._normalGet = new WGSLNormalGet("VertexOut");

        this._beginMobileFrag = new WGSLBeginMobileFrag("in", "out");
        this._beginViewDirFrag = new WGSLBeginViewDirFrag("in", "out");
        this._mobileBlinnphoneFrag = new WGSLMobileBlinnphongFrag("in", "out");
    }

    compile(macros: ShaderMacroCollection): [string, BindGroupInfo] {
        this._source = "";
        this._bindGroupInfo.clear();
        const inputStructCounter = WGSLEncoder.startCounter(0);
        {
            const encoder = this.createSourceEncoder(GPUShaderStage.FRAGMENT);
            this._common.execute(encoder, macros);
            this._commonFrag.execute(encoder, macros);
            this._uvShare.execute(encoder, macros, inputStructCounter);
            this._colorShare.execute(encoder, macros, inputStructCounter);
            this._normalShare.execute(encoder, macros, inputStructCounter);
            this._worldPosShare.execute(encoder, macros, inputStructCounter);
            this._lightFragDefine.execute(encoder, macros, inputStructCounter);
            this._mobileMaterialShare.execute(encoder, macros, inputStructCounter);
            this._normalGet.execute(encoder, macros, inputStructCounter);
            encoder.addInoutType("Output", 0, "finalColor", UniformType.Vec4f32);

            encoder.addEntry([["in", "VertexOut"]], ["out", "Output"], (() => {
                let source: string = "";
                source += this._beginMobileFrag.execute(macros);
                source += this._beginViewDirFrag.execute(macros);
                source += this._mobileBlinnphoneFrag.execute(macros);
                source += "out.finalColor = emission + ambient + diffuse + specular;\n";
                source += "out.finalColor.a = diffuse.a;\n";
                return source;
            }));
            encoder.flush();
        }
        WGSLEncoder.endCounter(inputStructCounter);
        return [this._source, this._bindGroupInfo];
    }
}
