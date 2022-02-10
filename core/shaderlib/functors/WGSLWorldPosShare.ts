import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";
import {ShaderMacroCollection} from "../../shader/ShaderMacroCollection";

export class WGSLWorldPosShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderMacroCollection, counterIndex: number) {
        if (macros.isEnable("NEED_WORLDPOS")) {
            encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                "v_pos", UniformType.Vec3f32);
        }
    }
}
