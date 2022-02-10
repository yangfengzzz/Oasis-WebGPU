import {WGSLEncoder} from "../WGSLEncoder";
import {UniformType} from "../WGSLCommon";
import {ShaderMacroCollection} from "../../shader/ShaderMacroCollection";

export class WGSLUVShare {
    private readonly _outputStructName: string;

    constructor(outputStructName: string) {
        this._outputStructName = outputStructName;
    }

    execute(encoder: WGSLEncoder, macros: ShaderMacroCollection, counterIndex: number) {
        encoder.addInoutType(this._outputStructName, WGSLEncoder.getCounterNumber(counterIndex),
            "v_uv", UniformType.Vec2f32);
    }
}
