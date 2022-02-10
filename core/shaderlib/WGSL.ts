import {BindGroupLayoutEntry} from "../webgpu";
import {ShaderMacroCollection} from "../shader/ShaderMacroCollection";
import {WGSLEncoder} from "./WGSLEncoder";

export type BindGroupInfo = Map<number, Set<number>>;
export type BindGroupLayoutEntryMap = Map<number, Map<number, BindGroupLayoutEntry>>;

export class WGSL {
    private _source: string;
    private _bindGroupInfo: BindGroupInfo = new Map<number, Set<number>>();
    private _bindGroupLayoutEntryMap: BindGroupLayoutEntryMap = new Map<number, Map<number, BindGroupLayoutEntry>>();

    get bindGroupLayoutEntryMap(): BindGroupLayoutEntryMap {
        return this._bindGroupLayoutEntryMap;
    }

    constructor(source: string, info: BindGroupInfo, entryMap: BindGroupLayoutEntryMap) {
        this._source = source;
        this._bindGroupInfo = info;
        this._bindGroupLayoutEntryMap = entryMap;
    }

    compile(macros: ShaderMacroCollection): [string, BindGroupInfo] {
        return [this._source, this._bindGroupInfo];
    }

    createSourceEncoder(currentStage: GPUShaderStage): WGSLEncoder {
        return new WGSLEncoder();
    }

    /**
     * @internal
     */
    _setSource(source: string) {
        this._source = source;
    }

    /**
     * @internal
     */
    _setBindGroupInfo(info: BindGroupInfo) {
        this._bindGroupInfo = info;
    }

    /**
     * @internal
     */
    _setBindGroupLayoutEntryMap(map: BindGroupLayoutEntryMap) {
        const bindGroupLayoutEntryMap = this._bindGroupLayoutEntryMap;
        map.forEach(((value, key) => {
            if (bindGroupLayoutEntryMap.has(key)) {
                value.forEach(((value1, key1) => {
                    if (!bindGroupLayoutEntryMap[key].has(key1)) {
                        bindGroupLayoutEntryMap[key][key1] = value1;
                    }
                }));
            } else {
                bindGroupLayoutEntryMap[key] = value;
            }
        }));
    }
}
