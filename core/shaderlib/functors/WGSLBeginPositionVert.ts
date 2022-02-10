import {ShaderData} from "../../shader";

export class WGSLBeginPositionVert {
    private readonly _input: string;
    private readonly _output: string;
    private readonly _formatTemplate: string;

    constructor(input: string, output: string) {
        this._input = input;
        this._output = output;
        this._formatTemplate = `var position = vec4<f32>( ${input}.Position , 1.0 );\\n`;
    }

    execute(source: string, macros: ShaderData) {
        source += this._formatTemplate;
    }
}
