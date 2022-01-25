import {Subpass} from "../Subpass";
import {RenderContext} from "../RenderContext";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {PipelineLayoutDescriptor} from "../../webgpu/PipelineLayoutDescriptor";
import {DepthStencilState, FragmentState, MultisampleState, PrimitiveState, VertexState} from "../../webgpu/state";

export class ForwardSubpass extends Subpass {
    private _forwardPipelineDescriptor: RenderPipelineDescriptor = new RenderPipelineDescriptor();
    private _depthStencilState = new DepthStencilState();
    private _fragment = new FragmentState();
    private _primitive = new PrimitiveState();
    private _multisample = new MultisampleState();
    private _vertex = new VertexState();

    private _pipelineLayoutDescriptor: PipelineLayoutDescriptor;

    constructor(renderContext: RenderContext) {
        super(renderContext);
        this._forwardPipelineDescriptor.depthStencil = this._depthStencilState;
        this._forwardPipelineDescriptor.fragment = this._fragment;
        this._forwardPipelineDescriptor.primitive = this._primitive;
        this._forwardPipelineDescriptor.multisample = this._multisample;
        this._forwardPipelineDescriptor.vertex = this._vertex;
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
    }

    prepare(): void {
        this._pipelineLayoutDescriptor = new PipelineLayoutDescriptor();
        this._forwardPipelineDescriptor.layout = this._renderContext.device.createPipelineLayout(this._pipelineLayoutDescriptor);
        this._primitive.topology = 'triangle-list';
        this._depthStencilState.format = 'depth24plus-stencil8';
        this._depthStencilState.depthWriteEnabled = true;
        this._depthStencilState.depthCompare = 'less';
    }

    draw(scene: Scene, camera: Camera, commandEncoder: GPURenderPassEncoder): void {
        commandEncoder.pushDebugGroup("Draw Element");
        this._drawMeshes(commandEncoder);
        commandEncoder.popDebugGroup();
    }

    _drawMeshes(commandEncoder: GPURenderPassEncoder): void {
        let renderPipeline = this._renderContext.device.createRenderPipeline(this._forwardPipelineDescriptor);
        commandEncoder.setPipeline(renderPipeline);
    }
}