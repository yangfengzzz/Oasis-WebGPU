import {RenderContext} from "./RenderContext";
import {Scene} from "../Scene";
import {Camera} from "../Camera";
import {RenderPass} from "./RenderPass";

export abstract class Subpass {
    protected _pass: RenderPass;
    protected _renderContext: RenderContext;

    protected constructor(renderContext: RenderContext) {
        this._renderContext = renderContext;
    }

    /**
     * @brief Prepares the shaders and shader variants for a subpass
     */
    abstract prepare(): void;

    /**
     * @brief Draw virtual function
     * @param scene
     * @param camera
     * @param renderPassEncoder GPURenderPassEncoder to use to record draw commands
     */
    abstract draw(scene: Scene, camera: Camera, renderPassEncoder: GPURenderPassEncoder);

    setRenderPass(pass: RenderPass): void {
        this._pass = pass;
    }

}