import {Subpass} from "../Subpass";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {
    BindGroupDescriptor,
    BindGroupEntry,
    DepthStencilState,
    FragmentState,
    MultisampleState,
    PipelineLayoutDescriptor,
    PrimitiveState,
    RenderPipelineDescriptor,
    VertexState,
    ColorTargetState, BindGroupLayout
} from "../../webgpu";
import {Engine} from "../../Engine";
import {RenderElement} from "../RenderElement";
import {Shader} from "../../shader";
import {ShaderMacroCollection} from "../../shader/ShaderMacroCollection";
import {Material} from "../../material";
import {Renderer} from "../../Renderer";
import {ShaderDataGroup} from "../../shader/ShaderDataGroup";

export class ForwardSubpass extends Subpass {
    static readonly _compileMacros: ShaderMacroCollection = new ShaderMacroCollection();

    private _scene: Scene;
    private _camera: Camera;
    private _opaqueQueue: RenderElement[] = [];
    private _alphaTestQueue: RenderElement[] = [];
    private _transparentQueue: RenderElement[] = [];

    private _forwardPipelineDescriptor: RenderPipelineDescriptor = new RenderPipelineDescriptor();
    private _depthStencilState = new DepthStencilState();
    private _fragment = new FragmentState();
    private _primitive = new PrimitiveState();
    private _multisample = new MultisampleState();
    private _vertex = new VertexState();

    private _bindGroupDescriptor = new BindGroupDescriptor();
    private _bindGroupEntries: BindGroupEntry[] = [];

    private _pipelineLayoutDescriptor = new PipelineLayoutDescriptor();
    private _pipelineLayout: GPUPipelineLayout;

    constructor(engine: Engine) {
        super(engine);
    }

    prepare(): void {
        this._forwardPipelineDescriptor.depthStencil = this._depthStencilState;
        this._forwardPipelineDescriptor.fragment = this._fragment;
        this._forwardPipelineDescriptor.primitive = this._primitive;
        this._forwardPipelineDescriptor.multisample = this._multisample;
        this._forwardPipelineDescriptor.vertex = this._vertex;
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
        {
            this._depthStencilState.format = this._engine.renderContext.depthStencilTextureFormat();

            this._fragment.targets.length = 1;
            const colorTargetState = new ColorTargetState();
            colorTargetState.format = this._engine.renderContext.drawableTextureFormat();
            this._fragment.targets[0] = colorTargetState;

            this._vertex.entryPoint = 'main';
            this._fragment.entryPoint = 'main';
        }
    }

    draw(scene: Scene, camera: Camera, renderPassEncoder: GPURenderPassEncoder): void {
        this._scene = scene;
        this._camera = camera;

        renderPassEncoder.pushDebugGroup("Draw Element");
        renderPassEncoder.setViewport(0, 0, this._engine.canvas.width, this._engine.canvas.height, 0, 1);
        this._drawMeshes(renderPassEncoder);
        renderPassEncoder.popDebugGroup();
    }

    private _drawMeshes(renderPassEncoder: GPURenderPassEncoder): void {
        this._opaqueQueue = [];
        this._alphaTestQueue = [];
        this._transparentQueue = [];
        this._engine._componentsManager.callRender(this._camera, this._opaqueQueue, this._alphaTestQueue, this._transparentQueue);
        this._opaqueQueue.sort(Subpass._compareFromNearToFar);
        this._alphaTestQueue.sort(Subpass._compareFromNearToFar);
        this._transparentQueue.sort(Subpass._compareFromFarToNear);

        this._drawElement(renderPassEncoder, this._opaqueQueue);
        this._drawElement(renderPassEncoder, this._alphaTestQueue);
        this._drawElement(renderPassEncoder, this._transparentQueue);
    }

    private _drawElement(renderPassEncoder: GPURenderPassEncoder, items: RenderElement[]) {
        const compileMacros = ForwardSubpass._compileMacros;

        for (let i = 0, n = items.length; i < n; i++) {
            const {mesh, subMesh, material, renderer} = items[i];
            // union render global macro and material self macro.
            ShaderMacroCollection.unionCollection(
                this._camera._globalShaderMacro,
                renderer.shaderData._macroCollection,
                compileMacros
            );

            ShaderMacroCollection.unionCollection(
                compileMacros,
                material.shaderData._macroCollection,
                compileMacros
            );

            const device = this._engine.device;
            // PSO
            {
                const shader = material.shader;
                const program = shader.getShaderProgram(this._engine, compileMacros);
                this._vertex.module = program.vertexShader;
                this._fragment.module = program.fragmentShader;

                const bindGroupDescriptor = this._bindGroupDescriptor;
                const bindGroupEntries = this._bindGroupEntries;

                const bindGroupLayoutDescriptors = program.bindGroupLayoutDescriptorMap;
                let bindGroupLayouts: BindGroupLayout[] = [];
                bindGroupLayoutDescriptors.forEach(((descriptor, group) => {
                    const bindGroupLayout = device.createBindGroupLayout(descriptor);
                    this._bindGroupEntries = [];
                    bindGroupEntries.length = descriptor.entries.length;
                    for (let i = 0, n = descriptor.entries.length; i < n; i++) {
                        const entry = descriptor.entries[i];
                        bindGroupEntries[i] = new BindGroupEntry(); // cache
                        bindGroupEntries[i].binding = entry.binding;
                        if (entry.buffer !== undefined) {
                            this._bindingData(bindGroupEntries[i], material, renderer);
                        } else if (entry.texture !== undefined || entry.storageTexture !== undefined) {
                            this._bindingTexture(bindGroupEntries[i], material, renderer);
                        } else if (entry.sampler !== undefined) {
                            this._bindingSampler(bindGroupEntries[i], material, renderer);
                        }
                    }
                    bindGroupDescriptor.layout = bindGroupLayout;
                    bindGroupDescriptor.entries = bindGroupEntries;
                    const uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
                    renderPassEncoder.setBindGroup(group, uniformBindGroup);
                    bindGroupLayouts.push(bindGroupLayout);
                }));
                shader.flush();

                this._pipelineLayoutDescriptor.bindGroupLayouts = bindGroupLayouts;
                this._pipelineLayout = device.createPipelineLayout(this._pipelineLayoutDescriptor);
                this._forwardPipelineDescriptor.layout = this._pipelineLayout;

                material.renderState._apply(this._forwardPipelineDescriptor, renderPassEncoder, false);

                this._vertex.buffers.length = mesh._vertexBufferLayouts.length;
                for (let j = 0, m = mesh._vertexBufferLayouts.length; j < m; j++) {
                    this._vertex.buffers[j] = mesh._vertexBufferLayouts[j];
                }
                this._forwardPipelineDescriptor.primitive.topology = subMesh.topology;

                const renderPipeline = device.createRenderPipeline(this._forwardPipelineDescriptor);
                renderPassEncoder.setPipeline(renderPipeline);
            }

            for (let j = 0, m = mesh._vertexBufferBindings.length; j < m; j++) {
                renderPassEncoder.setVertexBuffer(j, mesh._vertexBufferBindings[j].buffer);
            }
            renderPassEncoder.setIndexBuffer(mesh._indexBufferBinding.buffer.buffer, mesh._indexBufferBinding.format);
            renderPassEncoder.drawIndexed(subMesh.count, 1, subMesh.start, 0, 0);
        }
    }

    _bindingData(entry: BindGroupEntry,
                 mat: Material, renderer: Renderer) {
        const group = Shader.getShaderPropertyGroup(entry.binding);
        if (group != null) {
            switch (group) {
                case ShaderDataGroup.Scene:
                    entry.resource = this._scene.shaderData._getDataBuffer(entry.binding);
                    break;

                case ShaderDataGroup.Camera:
                    entry.resource = this._camera.shaderData._getDataBuffer(entry.binding);
                    break;

                case ShaderDataGroup.Renderer:
                    entry.resource = renderer.shaderData._getDataBuffer(entry.binding);
                    break;

                case ShaderDataGroup.Material:
                    entry.resource = mat.shaderData._getDataBuffer(entry.binding);
                    break;

                default:
                    break;
            }
        }
    }

    _bindingTexture(entry: BindGroupEntry,
                    mat: Material, renderer: Renderer) {
        const group = Shader.getShaderPropertyGroup(entry.binding);
        if (group != null) {
            switch (group) {
                case ShaderDataGroup.Scene:
                    entry.resource = this._scene.shaderData.getTextureView(entry.binding);
                    break;

                case ShaderDataGroup.Camera:
                    entry.resource = this._camera.shaderData.getTextureView(entry.binding);
                    break;

                case ShaderDataGroup.Renderer:
                    entry.resource = renderer.shaderData.getTextureView(entry.binding);
                    break;

                case ShaderDataGroup.Material:
                    entry.resource = mat.shaderData.getTextureView(entry.binding);
                    break;

                default:
                    break;
            }
        }
    }

    _bindingSampler(entry: BindGroupEntry,
                    mat: Material, renderer: Renderer) {
        const group = Shader.getShaderPropertyGroup(entry.binding);
        if (group != null) {
            switch (group) {
                case ShaderDataGroup.Scene:
                    entry.resource = this._scene.shaderData.getSampler(entry.binding);
                    break;

                case ShaderDataGroup.Camera:
                    entry.resource = this._camera.shaderData.getSampler(entry.binding);
                    break;

                case ShaderDataGroup.Renderer:
                    entry.resource = renderer.shaderData.getSampler(entry.binding);
                    break;

                case ShaderDataGroup.Material:
                    entry.resource = mat.shaderData.getSampler(entry.binding);
                    break;

                default:
                    break;
            }
        }
    }
}
