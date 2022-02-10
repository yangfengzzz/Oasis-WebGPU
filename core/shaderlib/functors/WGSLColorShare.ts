import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";
import {ShaderMacroCollection} from "../../shader/ShaderMacroCollection";

export class WGSLColorShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderMacroCollection, counterIndex: number) {
        if (macros.isEnable("HAS_VERTEXCOLOR")) {
            encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                "v_color", UniformType.Vec4f32);
        }
    }
}
