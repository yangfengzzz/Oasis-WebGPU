import {WGSLEncoder} from "../WGSLEncoder";
import {Attributes, UniformType} from "../WGSLCommon";
import {ShaderData} from "../../shader";

export class WGSLCommonVert {
    private _inputStructName: string;
    private _cameraStruct: string;
    private _rendererStruct: string;

    constructor(inputStructName: string) {
        this._inputStructName = inputStructName;

        this._cameraStruct = "struct CameraData {\n";
        this._cameraStruct += " u_viewMat: mat4x4<f32>;\n";
        this._cameraStruct += " u_projMat: mat4x4<f32>;\n";
        this._cameraStruct += " u_VPMat: mat4x4<f32>;\n";
        this._cameraStruct += " u_viewInvMat: mat4x4<f32>;\n";
        this._cameraStruct += " u_projInvMat: mat4x4<f32>;\n";
        this._cameraStruct += " u_cameraPos: vec3<f32>;\n";
        this._cameraStruct += "}\n";

        this._rendererStruct = "struct RendererData {\n";
        this._rendererStruct += " u_localMat: mat4x4<f32>;\n";
        this._rendererStruct += " u_modelMat: mat4x4<f32>;\n";
        this._rendererStruct += " u_MVMat: mat4x4<f32>;\n";
        this._rendererStruct += " u_MVPMat: mat4x4<f32>;\n";
        this._rendererStruct += " u_MVInvMat: mat4x4<f32>;\n";
        this._rendererStruct += " u_normalMat: mat4x4<f32>;\n";
        this._rendererStruct += "}\n";
    }

    execute(encoder: WGSLEncoder, macros: ShaderData) {
        const inputStructName = this._inputStructName;
        encoder.addAttributeType(inputStructName, Attributes.Position, UniformType.Vec3f32);
        if (macros.isEnable("HAS_UV")) {
            encoder.addAttributeType(inputStructName, Attributes.UV_0, UniformType.Vec2f32);
        }

        if (macros.isEnable("HAS_SKIN")) {
            encoder.addAttributeType(inputStructName, Attributes.Joints_0, UniformType.Vec4f32);
            encoder.addAttributeType(inputStructName, Attributes.Weights_0, UniformType.Vec4f32);
            if (macros.isEnable("HAS_JOINT_TEXTURE")) {
                // TODO
            } else {
                const num = macros.variableMacros("JOINTS_COUNT");
                if (num != undefined) {
                    encoder.addUniformBinding("u_jointMatrix", `array<mat4x4<f32>, ${num}>`, 0);
                }
            }
        }

        if (macros.isEnable("HAS_VERTEXCOLOR")) {
            encoder.addAttributeType(inputStructName, Attributes.Color_0, UniformType.Vec4f32);
        }

        encoder.addStruct(this._cameraStruct);
        encoder.addUniformBinding("u_cameraData", "CameraData", 0);
        encoder.addStruct(this._rendererStruct);
        encoder.addUniformBinding("u_rendererData", "RendererData", 0);

        encoder.addUniformBinding("u_tilingOffset", UniformType.Vec4f32, 0);

        if (!macros.isEnable("OMIT_NORMAL")) {
            if (macros.isEnable("HAS_NORMAL")) {
                encoder.addAttributeType(this._inputStructName, Attributes.Normal, UniformType.Vec3f32);
            }
            if (macros.isEnable("HAS_TANGENT")) {
                encoder.addAttributeType(this._inputStructName, Attributes.Tangent, UniformType.Vec4f32);
            }
        }
    }
}
