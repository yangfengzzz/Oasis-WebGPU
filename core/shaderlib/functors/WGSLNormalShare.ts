import {ShaderData} from "../../shader";
import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";

export class WGSLNormalShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderData, counterIndex: number) {
        const outputStructName = this._outputStructName;
        if (macros.isEnable("HAS_NORMAL")) {
            if (macros.isEnable("HAS_TANGENT") && macros.isEnable("HAS_NORMAL_TEXTURE")) {
                encoder.addInoutType(outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                    "v_normalW", UniformType.Vec3f32);
                encoder.addInoutType(outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                    "v_tangentW", UniformType.Vec3f32);
                encoder.addInoutType(outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                    "v_bitangentW", UniformType.Vec3f32);
            } else {
                encoder.addInoutType(outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                    "v_normal", UniformType.Vec3f32);
            }
        }
    }
}
