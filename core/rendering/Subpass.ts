import {View} from "../View";
import {Scene} from "../Scene";
import {Camera} from "../Camera";
import {RenderPass} from "./RenderPass";

export abstract class Subpass {
    protected _pass: RenderPass;

    protected _view: View;
    protected _scene: Scene;
    protected _camera: Camera;

    protected constructor(view: View,
                          scene: Scene,
                          camera: Camera) {
        this._view = view;
        this._scene = scene;
        this._camera = camera;
    }

    /**
     * @brief Prepares the shaders and shader variants for a subpass
     */
    abstract prepare(): void;

    /**
     * @brief Draw virtual function
     * @param renderPassEncoder GPURenderPassEncoder to use to record draw commands
     */
    abstract draw(renderPassEncoder: GPURenderPassEncoder);

    setRenderPass(pass: RenderPass): void {
        this._pass = pass;
    }

}