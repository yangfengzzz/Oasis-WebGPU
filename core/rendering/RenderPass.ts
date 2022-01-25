import {RenderPassDescriptor} from "../webgpu/RenderPassDescriptor";
import {Subpass} from "./Subpass";
import {Scene} from "../Scene";
import {Camera} from "../Camera";

export class RenderPass {
    private _desc: RenderPassDescriptor;

    private _subpasses: Subpass[] = [];
    private _activeSubpassIndex: number = 0;

    get renderPassDescriptor(): RenderPassDescriptor {
        return this._desc;
    }

    get subpasses(): Subpass[] {
        return this._subpasses;
    }

    /**
     * @return Subpass currently being recorded, or the first one
     *         if drawing has not started
     */
    get activeSubpass(): Subpass {
        return this._subpasses[this._activeSubpassIndex];
    }

    constructor(desc: RenderPassDescriptor) {
        this._desc = desc;
    }

    /**
     * @brief Appends a subpass to the pipeline
     * @param subpass Subpass to append
     */
    addSubpass(subpass: Subpass): void {
        this._subpasses.push(subpass);
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