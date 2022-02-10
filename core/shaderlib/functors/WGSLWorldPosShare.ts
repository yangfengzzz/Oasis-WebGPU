import {ShaderData} from "../../shader";
import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";

export class WGSLWorldPosShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderData, counterIndex: number) {
        if (macros.isEnable("NEED_WORLDPOS")) {
            encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                "v_pos", UniformType.Vec3f32);
        }
    }
}
