import {
    Attributes, attributesString, bindingType, BuiltInType, isMultisampled,
    SamplerType, samplerTypeString, sampleType,
    StorageTextureType, storageTextureTypeString, storageTextureViewDimension,
    TextureType,
    textureTypeString, textureViewDimension,
    UniformType,
    uniformTypeString
} from "./WGSLCommon";
import {BindGroupInfo, BindGroupLayoutEntryMap, WGSL} from "./WGSL";
import {Shader} from "../shader";
import {
    BindGroupLayoutEntry,
    BufferBindingLayout,
    SamplerBindingLayout,
    StorageTextureBindingLayout,
    TextureBindingLayout
} from "../webgpu";

export class WGSLEncoder {
    private static _counters: number[] = [];

    private _wgsl: WGSL;
    private _currentStage: number;

    private _source: string;
    private _bindGroupInfo: BindGroupInfo
    private _bindGroupLayoutEntryMap: BindGroupLayoutEntryMap
    private _needFlush: boolean = false;

    private _structBlock: string;
    private _uniformBlock: string;
    private _functionBlock: string
    private _inoutType: Map<string, string[]>;
    private _entryBlock: string;

    static startCounter(initVal: number = Attributes.TOTAL_COUNT): number {
        const counters = this._counters;
        for (let i = 0, n = counters.length; i < n; i++) {
            if (counters[i] == -1) {
                counters[i] = initVal;
                return i;
            }
        }

        counters.push(initVal);
        return counters.length - 1;
    }

    static getCounterNumber(index: number): number {
        return this._counters[index]++;
    }

    static endCounter(index: number) {
        this._counters[index] = -1;
    }

    addStruct(code: string) {
        this._structBlock += code;
        this._needFlush = true;
    }

    addFunction(code: string) {
        this._functionBlock += code;
        this._needFlush = true;
    }

    addUniformBinding(uniformName: string, type: UniformType, group: number);

    addUniformBinding(uniformName: string, type: string, group: number);

    addUniformBinding(uniformName: string, typeOrName: string | UniformType, group: number = 0) {
        if (typeof typeOrName !== 'string') {
            typeOrName = uniformTypeString(typeOrName);
        }

        const property = Shader.getPropertyByName(uniformName);
        if (property !== null) {
            const binding = property._uniqueId;

            this._uniformBlock += `@group(${group.toString()}) @binding(${binding.toString()})\n var<uniform> ${uniformName}: ${typeOrName};\n `;
            const entry = new BindGroupLayoutEntry();
            entry.binding = binding;
            entry.visibility = this._currentStage;
            entry.buffer = new BufferBindingLayout();
            entry.buffer.type = 'uniform';

            const bindGroupLayoutEntryMap = this._bindGroupLayoutEntryMap;
            if (!bindGroupLayoutEntryMap.has(group)) {
                bindGroupLayoutEntryMap[group] = [];
                bindGroupLayoutEntryMap[group][binding] = entry;
            } else {
                if (!bindGroupLayoutEntryMap[group].has(binding)) {
                    bindGroupLayoutEntryMap[group][binding] = entry;
                }
            }
            this._bindGroupInfo[group].push(binding);
            this._needFlush = true;
        } else {
            throw  "Unknown Uniform Name";
        }
    }

    addSampledTextureBinding(texName: string, texType: TextureType,
                             samplerName: string, samplerType: SamplerType,
                             group: number = 0) {
        const texProperty = Shader.getPropertyByName(texName);
        const samplerProperty = Shader.getPropertyByName(samplerName);
        if (texProperty != undefined && samplerProperty != undefined) {
            const texBinding = texProperty._uniqueId;
            const samplerBinding = samplerProperty._uniqueId;

            this._uniformBlock += `@group(${group}) @binding(${texBinding}) 
            var ${texName}: ${textureTypeString(texType)};\n 
            @group(${group}) @binding(${samplerBinding}) 
            var ${samplerName}: ${samplerTypeString(samplerType)};\n `;

            const bindGroupLayoutEntryMap = this._bindGroupLayoutEntryMap;
            // Texture
            {
                const entry = new BindGroupLayoutEntry();
                entry.binding = texBinding;
                entry.visibility = this._currentStage;
                entry.texture = new TextureBindingLayout();
                entry.texture.multisampled = isMultisampled(texType);
                entry.texture.viewDimension = textureViewDimension(texType);
                entry.texture.sampleType = sampleType(texType);
                if (!bindGroupLayoutEntryMap.has(group)) {
                    bindGroupLayoutEntryMap[group] = [];
                    bindGroupLayoutEntryMap[group][texBinding] = entry;
                } else {
                    if (!bindGroupLayoutEntryMap[group].has(texBinding)) {
                        bindGroupLayoutEntryMap[group][texBinding] = entry;
                    }
                }
                this._bindGroupInfo[group].push(texBinding);
            }
            // Sampler
            {
                const entry = new BindGroupLayoutEntry();
                entry.binding = samplerBinding;
                entry.visibility = this._currentStage;
                entry.sampler = new SamplerBindingLayout();
                entry.sampler.type = bindingType(samplerType);
                if (!bindGroupLayoutEntryMap.has(group)) {
                    bindGroupLayoutEntryMap[group] = [];
                    bindGroupLayoutEntryMap[group][samplerBinding] = entry;
                } else {
                    if (!bindGroupLayoutEntryMap[group].has(samplerBinding)) {
                        bindGroupLayoutEntryMap[group][samplerBinding] = entry;
                    }
                }
                this._bindGroupInfo[group].push(samplerBinding);
            }
            this._needFlush = true;
        } else {
            throw  "Unknown Uniform Name";
        }
    }

    addStorageTextureBinding(texName: string, texType: StorageTextureType,
                             texelFormat: GPUTextureFormat, group: number = 0) {
        const property = Shader.getPropertyByName(texName);
        if (property !== null) {
            const binding = property._uniqueId;
            this._uniformBlock += `@group(${group}) @binding(${binding})\n 
            var ${texName}: ${storageTextureTypeString(texType)}<${texelFormat.toString()}, write>;\n `

            const entry = new BindGroupLayoutEntry();
            entry.binding = binding;
            entry.visibility = this._currentStage;
            entry.storageTexture = new StorageTextureBindingLayout();
            entry.storageTexture.format = texelFormat;
            entry.storageTexture.viewDimension = storageTextureViewDimension(texType);
            entry.storageTexture.access = 'write-only';

            const bindGroupLayoutEntryMap = this._bindGroupLayoutEntryMap;
            if (!bindGroupLayoutEntryMap.has(group)) {
                bindGroupLayoutEntryMap[group] = [];
                bindGroupLayoutEntryMap[group][binding] = entry;
            } else {
                if (!bindGroupLayoutEntryMap[group].has(binding)) {
                    bindGroupLayoutEntryMap[group][binding] = entry;
                }
            }
            this._bindGroupInfo[group].push(binding);
            this._needFlush = true;
        } else {
            throw  "Unknown Uniform Name";
        }
    }

    addInoutType(structName: string, location: number, attributes: string, type: UniformType);

    addInoutType(structName: string, location: number, attributes: string, type: string);

    addInoutType(structName: string, location: number, attributes: string, typeOrName: string | UniformType) {
        if (typeof typeOrName !== 'string') {
            typeOrName = uniformTypeString(typeOrName);
        }

        const formatTemplate = `@location(${location}) ${attributes}: ${typeOrName};`;
        if (this._inoutType[structName] === undefined) {
            this._inoutType[structName] = [];
        }
        this._inoutType[structName].push(formatTemplate);
        this._needFlush = true;
    }

    addBuiltInoutType(structName: string, builtin: BuiltInType, attributes: string, type: UniformType);

    addBuiltInoutType(structName: string, builtin: BuiltInType, attributes: string, type: string);

    addBuiltInoutType(structName: string, builtin: BuiltInType, attributes: string, typeOrName: string | UniformType) {
        if (typeof typeOrName !== 'string') {
            typeOrName = uniformTypeString(typeOrName);
        }

        const formatTemplate = `@builtin(${builtin}) ${attributes}: ${typeOrName};`;
        if (this._inoutType[structName] === undefined) {
            this._inoutType[structName] = [];
        }
        this._inoutType[structName].push(formatTemplate);
        this._needFlush = true;
    }

    addAttributeType(structName: string, attributes: Attributes, type: UniformType) {
        this.addInoutType(structName, attributes, attributesString(attributes), uniformTypeString(type));
    }

    addEntry(inParam: [string, string][], outType: [string, string], code: () => string) {
        if (this._currentStage == GPUShaderStage.VERTEX) {
            this._entryBlock += "@stage(vertex)\n";
        } else if (this._currentStage == GPUShaderStage.FRAGMENT) {
            this._entryBlock += "@stage(fragment)\n";
        } else {
            throw  "Use Begin at first";
        }

        this._entryBlock += "fn main(";
        for (const param in inParam) {
            this._entryBlock += param[0];
            this._entryBlock += ": ";
            this._entryBlock += param[1];
            this._entryBlock += ", ";
        }
        this._entryBlock += ") -> ";
        this._entryBlock += outType[1];
        this._entryBlock += " {\n";

        this._entryBlock += `var ${outType[0]}:${outType[1]};\n`;

        this._entryBlock += code();

        this._entryBlock += `return ${outType[0]};\n`;
        this._entryBlock += "}\n";

        this._needFlush = true;
    }

    flush() {
        if (this._needFlush) {
            this._buildSource();
            this._wgsl._setSource(this._source);
            this._wgsl._setBindGroupInfo(this._bindGroupInfo);
            this._wgsl._setBindGroupLayoutEntryMap(this._bindGroupLayoutEntryMap);
            this.clearCache();
        }
    }

    clearCache() {
        this._structBlock = "";
        this._uniformBlock = "";
        this._functionBlock = "";
        this._inoutType.clear();
        this._entryBlock = "";
        this._needFlush = false;
    }

    /**
     * @internal
     * @param wgsl
     * @param currentStage
     */
    constructor(wgsl: WGSL, currentStage: number) {
        this._wgsl = wgsl;
        this._currentStage = currentStage;
    }

    private _buildSource() {
        this._source = "";
        this._source += this._structBlock;
        this._source += this._uniformBlock;
        // Inout
        {
            this._inoutType.forEach(((value, key) => {
                this._source += "struct ";
                this._source += key;
                this._source += " {\n";
                for (const typeInfo in value) {
                    this._source += typeInfo;
                    this._source += "\n";
                }
                this._source += "}\n";
            }))
        }
        this._source += this._functionBlock;
        this._source += this._entryBlock;
    }
}
