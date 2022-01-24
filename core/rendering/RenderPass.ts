import {RenderPassDescriptor} from "../webgpu/RenderPassDescriptor";
import {Subpass} from "./Subpass";
import {Scene} from "../Scene";
import {Camera} from "../Camera";

export class RenderPass {
    private _desc: RenderPassDescriptor;

    private _subpasses: Subpass[];
    private _activeSubpassIndex: number;

    constructor(desc: RenderPassDescriptor) {
        this._desc = desc;
    }

    draw(scene: Scene, camera: Camera, commandEncoder: GPUCommandEncoder) {
        const renderPassEncoder = commandEncoder.beginRenderPass(this._desc);
        for (let i: number = 0; i < this._subpasses.length; ++i) {
            this._activeSubpassIndex = i;
            this._subpasses[i].draw(scene, camera, renderPassEncoder);
        }
        this._activeSubpassIndex = 0;
        renderPassEncoder.endPass();
    }
}