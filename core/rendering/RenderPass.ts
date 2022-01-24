import {RenderPassDescriptor} from "../webgpu/RenderPassDescriptor";
import {Subpass} from "./Subpass";

export class RenderPass {
    private _desc: RenderPassDescriptor;

    private _subpasses: Subpass[];
    private _activeSubpassIndex: number;

    constructor(desc: RenderPassDescriptor) {
        this._desc = desc;
    }

    draw(commandEncoder: GPUCommandEncoder) {
        const renderPassEncoder = commandEncoder.beginRenderPass(this._desc);
        for (let i: number = 0; i < this._subpasses.length; ++i) {
            this._activeSubpassIndex = i;
            this._subpasses[i].draw(renderPassEncoder);
        }
        this._activeSubpassIndex = 0;
        renderPassEncoder.endPass();
    }
}