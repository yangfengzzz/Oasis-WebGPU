import {ShaderData} from "../../shader";
import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";

export class WGSLUVShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderData, counterIndex: number) {
        encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
            "v_uv", UniformType.Vec2f32);
    }
}
