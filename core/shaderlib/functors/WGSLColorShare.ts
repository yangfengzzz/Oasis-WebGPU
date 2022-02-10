import {ShaderData} from "../../shader";
import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";

export class WGSLColorShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderData, counterIndex: number) {
        if (macros.isEnable("HAS_VERTEXCOLOR")) {
            encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
                "v_color", UniformType.Vec4f32);
        }
    }
}
