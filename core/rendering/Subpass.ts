import {Scene} from "../Scene";
import {Camera} from "../Camera";
import {RenderPass} from "./RenderPass";
import {EngineObject} from "../base";
import {Engine} from "../Engine";

export abstract class Subpass extends EngineObject {
    protected _pass: RenderPass;

    protected constructor(engine: Engine) {
        super(engine);
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