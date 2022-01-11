import {Camera} from "../Camera";

/**
 * Basic render pipeline.
 */
export class BasicRenderPipeline {
    private _camera: Camera;

    /**
     * Create a basic render pipeline.
     * @param camera - Camera
     */
    constructor(camera: Camera) {
        this._camera = camera;
    }

    /**
     * Destroy internal resources.
     */
    destroy(): void {
        this._camera = null;
    }

    /**
     * Perform scene rendering.
     */
    render(){
        const camera = this._camera;
        camera.engine._componentsManager.callRender(this._camera);
    }
}