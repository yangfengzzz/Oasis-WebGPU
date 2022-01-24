import {Subpass} from "../Subpass";
import {View} from "../../View";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {PipelineLayoutDescriptor} from "../../webgpu/PipelineLayoutDescriptor";

export class ForwardSubpass extends Subpass {
    private _forwardPipelineDescriptor: RenderPipelineDescriptor;
    private _pipelineLayoutDescriptor: PipelineLayoutDescriptor;

    constructor(view: View,
                scene: Scene,
                camera: Camera) {
        super(view, scene, camera);
    }

    prepare(): void {
        this._pipelineLayoutDescriptor = new PipelineLayoutDescriptor();
        let layout: GPUPipelineLayout = this._view.device.createPipelineLayout(this._pipelineLayoutDescriptor);

        this._forwardPipelineDescriptor = new RenderPipelineDescriptor();
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
        this._forwardPipelineDescriptor.layout = layout;
        this._forwardPipelineDescriptor.primitive.topology = 'triangle-list';
        this._forwardPipelineDescriptor.depthStencil.format = 'depth24plus-stencil8';
        this._forwardPipelineDescriptor.depthStencil.depthWriteEnabled = true;
        this._forwardPipelineDescriptor.depthStencil.depthCompare = 'less';
    }

    draw(commandEncoder: GPURenderPassEncoder): void {
        let renderPipeline = this._view.device.createRenderPipeline(this._forwardPipelineDescriptor);
        commandEncoder.setPipeline(renderPipeline);

    }
}