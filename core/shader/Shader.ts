import {ShaderDataGroup} from "./ShaderDataGroup";
import {ShaderMacro} from "./ShaderMacro";
import {ShaderMacroCollection} from "./ShaderMacroCollection";
import {ShaderProperty} from "./ShaderProperty";
import {BindGroupInfo, WGSL} from "../shaderlib";
import {Engine} from "../Engine";
import {ShaderProgram} from "./ShaderProgram";
import {BindGroupLayoutDescriptor, BindGroupLayoutEntry} from "../webgpu";

type BindGroupLayoutEntryVecMap = Map<number, BindGroupLayoutEntry[]>;
type BindGroupLayoutDescriptorMap = Map<number, BindGroupLayoutDescriptor>;

/**
 * Shader containing vertex and fragment source.
 */
export class Shader {
    /** @internal */
    static readonly _compileMacros: ShaderMacroCollection = new ShaderMacroCollection();

    private static _shaderCounter: number = 0;
    private static _shaderMap: Record<string, Shader> = Object.create(null);
    private static _propertyNameMap: Record<string, ShaderProperty> = Object.create(null);
    private static _macroMaskMap: string[][] = [];
    private static _macroCounter: number = 0;
    private static _macroMap: Record<string, ShaderMacro> = Object.create(null);

    /**
     * Create a shader.
     * @param name - Name of the shader
     * @param vertexSource - Vertex source code
     * @param fragmentSource - Fragment source code
     */
    static create(name: string, vertexSource: WGSL, fragmentSource: WGSL): Shader {
        const shaderMap = Shader._shaderMap;
        if (shaderMap[name]) {
            throw `Shader named "${name}" already exists.`;
        }
        return (shaderMap[name] = new Shader(name, vertexSource, fragmentSource));
    }

    /**
     * Find a shader by name.
     * @param name - Name of the shader
     */
    static find(name: string): Shader {
        return Shader._shaderMap[name];
    }

    /**
     * Get shader macro by name.
     * @param name - Name of the shader macro
     * @returns Shader macro
     */
    static getMacroByName(name: string): ShaderMacro {
        let macro = Shader._macroMap[name];
        if (!macro) {
            const maskMap = Shader._macroMaskMap;
            const counter = Shader._macroCounter;
            const index = Math.floor(counter / 32);
            const bit = counter % 32;
            macro = new ShaderMacro(name, index, 1 << bit);
            Shader._macroMap[name] = macro;
            if (index == maskMap.length) {
                maskMap.length++;
                maskMap[index] = new Array<string>(32);
            }
            maskMap[index][bit] = name;
            Shader._macroCounter++;
        }
        return macro;
    }

    /**
     * Get shader property by name.
     * @param name - Name of the shader property
     * @returns Shader property
     */
    static getPropertyByName(name: string): ShaderProperty {
        const propertyNameMap = Shader._propertyNameMap;
        if (propertyNameMap[name] != null) {
            return propertyNameMap[name];
        } else {
            const property = new ShaderProperty(name);
            propertyNameMap[name] = property;
            return property;
        }
    }

    /**
     * @internal
     */
    static _getShaderPropertyGroup(propertyName: string): ShaderDataGroup | null {
        const shaderProperty = Shader._propertyNameMap[propertyName];
        return shaderProperty?._group;
    }

    private static _getNamesByMacros(macros: ShaderMacroCollection, out: string[]): void {
        const maskMap = Shader._macroMaskMap;
        const mask = macros._mask;
        out.length = 0;
        for (let i = 0, n = macros._length; i < n; i++) {
            const subMaskMap = maskMap[i];
            const subMask = mask[i];
            const n = subMask < 0 ? 32 : Math.floor(Math.log2(subMask)) + 1; // if is negative must contain 1 << 31.
            for (let j = 0; j < n; j++) {
                if (subMask & (1 << j)) {
                    out.push(subMaskMap[j]);
                }
            }
        }
    }

    /** The name of shader. */
    readonly name: string;

    /** @internal */
    _shaderId: number = 0;

    private _vertexSource: WGSL;
    private readonly _fragmentSource: WGSL;
    private _bindGroupInfo: BindGroupInfo;
    private _bindGroupLayoutEntryVecMap: BindGroupLayoutEntryVecMap;
    private _bindGroupLayoutDescriptorMap: BindGroupLayoutDescriptorMap;

    get bindGroupLayoutDescriptorMap(): BindGroupLayoutDescriptorMap {
        return this._bindGroupLayoutDescriptorMap;
    }

    private constructor(name: string, vertexSource: WGSL, fragmentSource: WGSL) {
        this._shaderId = Shader._shaderCounter++;
        this.name = name;
        this._vertexSource = vertexSource;
        this._fragmentSource = fragmentSource;
    }

    /**
     * Compile shader variant by macro name list.
     *
     * @remarks
     * Usually a shader contains some macros,any combination of macros is called shader variant.
     *
     * @param engine - Engine to which the shader variant belongs
     * @param macroCollection - Macro name list
     */
    getShaderProgram(engine: Engine, macroCollection: ShaderMacroCollection): ShaderProgram {
        const shaderProgramPool = engine._getShaderProgramPool(this);
        let shaderProgram = shaderProgramPool.get(macroCollection);
        if (shaderProgram) {
            return shaderProgram;
        }

        // merge info
        const vertexCode = this._vertexSource.compile(macroCollection);
        vertexCode[1].forEach(((value, key) => {
            value.forEach((value1 => {
                this._bindGroupInfo[key].push(value1);
            }))
        }));
        const fragmentCode = this._fragmentSource.compile(macroCollection);
        fragmentCode[1].forEach(((value, key) => {
            value.forEach((value1 => {
                this._bindGroupInfo[key].push(value1);
            }))
        }));

        // move to vecMap
        this._bindGroupInfo.forEach(((value, key) => {
            this._bindGroupLayoutEntryVecMap[key].length = value.size;
            value.forEach((value1 => {
                this._bindGroupLayoutEntryVecMap[key].push(this._findEntry(key, value1));
            }));
        }));

        // generate map
        this._bindGroupLayoutEntryVecMap.forEach(((value, key) => {
            const desc = new BindGroupLayoutDescriptor();
            desc.entries = value;
            this._bindGroupLayoutDescriptorMap[key] = desc;
        }));


        shaderProgram = new ShaderProgram(engine.device, vertexCode[0], fragmentCode[0]);
        shaderProgramPool.cache(shaderProgram);
        return shaderProgram;
    }

    flush() {
        this._bindGroupInfo.clear();
        this._bindGroupLayoutEntryVecMap.clear();
        this._bindGroupLayoutDescriptorMap.clear();
    }

    _findEntry(group: number, binding: number): BindGroupLayoutEntry {
        let entry: BindGroupLayoutEntry = undefined;

        const entryMap = this._vertexSource.bindGroupLayoutEntryMap;
        if (entryMap.has(group) && entryMap[group].has(binding)) {
            entry = entryMap[group][binding];
        }

        if (this._fragmentSource) {
            const entryMap = this._fragmentSource.bindGroupLayoutEntryMap;
            if (entryMap.has(group) && entryMap[group].has(binding)) {
                if (entry !== undefined) {
                    entry.visibility |= GPUShaderStage.FRAGMENT;
                } else {
                    entry = entryMap[group][binding];
                }
            }
        }

        if (entry !== undefined) {
            return entry;
        } else {
            throw "have bug!";
        }
    }
}
