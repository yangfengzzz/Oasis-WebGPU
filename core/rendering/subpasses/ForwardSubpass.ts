import {Subpass} from "../Subpass";
import {View} from "../../View";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";

export class ForwardSubpass extends Subpass {
    private _forwardPipelineDescriptor: RenderPipelineDescriptor

    constructor(view: View,
                scene: Scene,
                camera: Camera) {
        super(view, scene, camera);
    }

    prepare(): void {
        this._forwardPipelineDescriptor = new RenderPipelineDescriptor();
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
    }

    draw(commandEncoder: GPURenderPassEncoder): void {

    }
}