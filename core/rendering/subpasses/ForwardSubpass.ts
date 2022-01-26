import {Subpass} from "../Subpass";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {ShaderProgram} from "../../shader/ShaderProgram";
import vxCode from "../../../shader/vertex.wgsl";
import fxCode from "../../../shader/fragment.wgsl";
import {
    BindGroupDescriptor,
    BindGroupEntry,
    BindGroupLayoutDescriptor,
    BindGroupLayoutEntry,
    BufferBinding,
    BufferBindingLayout,
    DepthStencilState,
    FragmentState,
    MultisampleState,
    PipelineLayoutDescriptor,
    PrimitiveState,
    RenderPipelineDescriptor,
    VertexState,
    ColorTargetState
} from "../../webgpu";
import {Engine} from "../../Engine";
import {RenderElement} from "../RenderElement";

export class ForwardSubpass extends Subpass {
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

    private _bindGroupLayoutDescriptor = new BindGroupLayoutDescriptor();
    private _bindGroupLayout: GPUBindGroupLayout;
    private _bindGroupDescriptor = new BindGroupDescriptor();

    private _pipelineLayoutDescriptor = new PipelineLayoutDescriptor();
    private _pipelineLayout: GPUPipelineLayout;

    private _shaderProgram: ShaderProgram;

    constructor(engine: Engine) {
        super(engine);
        const device = this._engine.device;
        this._shaderProgram = new ShaderProgram(device, vxCode, fxCode);
        {
            this._bindGroupLayoutDescriptor.entries.length = 2;
            const uniform1 = new BindGroupLayoutEntry();
            uniform1.binding = 0;
            uniform1.visibility = GPUShaderStage.VERTEX;
            uniform1.buffer = new BufferBindingLayout();
            uniform1.buffer.type = 'uniform';
            this._bindGroupLayoutDescriptor.entries[0] = uniform1;
            const uniform2 = new BindGroupLayoutEntry();
            uniform2.binding = 1;
            uniform2.visibility = GPUShaderStage.VERTEX;
            uniform2.buffer = new BufferBindingLayout();
            uniform2.buffer.type = 'uniform';
            this._bindGroupLayoutDescriptor.entries[1] = uniform2;
            this._bindGroupLayout = device.createBindGroupLayout(this._bindGroupLayoutDescriptor);
        }
        {
            this._bindGroupDescriptor.layout = this._bindGroupLayout;
            this._bindGroupDescriptor.entries.length = 2;
            const uniform1 = new BindGroupEntry();
            uniform1.binding = 0;
            uniform1.resource = new BufferBinding();
            this._bindGroupDescriptor.entries[0] = uniform1;
            const uniform2 = new BindGroupEntry();
            uniform2.binding = 1;
            uniform2.resource = new BufferBinding();
            this._bindGroupDescriptor.entries[1] = uniform2;
        }
        this._forwardPipelineDescriptor.depthStencil = this._depthStencilState;
        this._forwardPipelineDescriptor.fragment = this._fragment;
        this._forwardPipelineDescriptor.primitive = this._primitive;
        this._forwardPipelineDescriptor.multisample = this._multisample;
        this._forwardPipelineDescriptor.vertex = this._vertex;
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
        {
            this._pipelineLayoutDescriptor.bindGroupLayouts.length = 1;
            this._pipelineLayoutDescriptor.bindGroupLayouts[0] = this._bindGroupLayout;
            this._pipelineLayout = device.createPipelineLayout(this._pipelineLayoutDescriptor);
            this._forwardPipelineDescriptor.layout = this._pipelineLayout;

            this._vertex.module = this._shaderProgram.vertexShader;
            this._vertex.entryPoint = 'main';

            this._fragment.module = this._shaderProgram.fragmentShader;
            this._fragment.entryPoint = 'main';

            this._fragment.targets.length = 1;
            const colorTargetState = new ColorTargetState();
            colorTargetState.format = this._engine.renderContext.drawableTextureFormat();
            this._fragment.targets[0] = colorTargetState;
            this._depthStencilState.format = this._engine.renderContext.depthStencilTextureFormat();
        }
    }

    prepare(): void {
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
        for (let i = 0, n = items.length; i < n; i++) {
            const {mesh, subMesh, material, component} = items[i];
            const device = this._engine.device;

            (<BufferBinding>this._bindGroupDescriptor.entries[0].resource).buffer = this._camera.shaderData.getMatrix("u_projMat");
            (<BufferBinding>this._bindGroupDescriptor.entries[1].resource).buffer = component.shaderData.getMatrix("u_MVMat");
            const uniformBindGroup = device.createBindGroup(this._bindGroupDescriptor);
            renderPassEncoder.setBindGroup(0, uniformBindGroup);

            this._vertex.buffers.length = mesh._vertexBufferLayouts.length;
            for (let j = 0, m = mesh._vertexBufferLayouts.length; j < m; j++) {
                this._vertex.buffers[j] = mesh._vertexBufferLayouts[j];
            }
            this._primitive.topology = subMesh.topology;
            material.renderState._apply(this._forwardPipelineDescriptor, renderPassEncoder, false);
            const renderPipeline = device.createRenderPipeline(this._forwardPipelineDescriptor);
            renderPassEncoder.setPipeline(renderPipeline);

            for (let j = 0, m = mesh._vertexBufferBindings.length; j < m; j++) {
                renderPassEncoder.setVertexBuffer(j, mesh._vertexBufferBindings[j]._nativeBuffer);
            }
            renderPassEncoder.setIndexBuffer(mesh._indexBufferBinding.buffer._nativeBuffer, mesh._indexBufferBinding.format);
            renderPassEncoder.drawIndexed(subMesh.count, 1, subMesh.start, 0, 0);
        }
    }
}