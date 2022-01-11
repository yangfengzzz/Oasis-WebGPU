import {WebGPUEngine} from "./webgpu/rhi-webgpu/WebGPUEngine";
import {Camera} from "./webgpu/Camera";
import {MeshRenderer} from "./webgpu/mesh/MeshRenderer";

const engine = new WebGPUEngine("canvas");
engine.canvas.resizeByClientSize();
engine.init().then(() => {
    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();

    // init camera
    const cameraEntity = rootEntity.createChild("camera");
    cameraEntity.addComponent(Camera);
    cameraEntity.transform.setPosition(10, 10, 10);

    const cubeEntity = rootEntity.createChild();
    cubeEntity.addComponent(MeshRenderer);

    engine.run();
});