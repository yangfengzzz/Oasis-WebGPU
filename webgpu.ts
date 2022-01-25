import {WebGPUEngine} from "./core/WebGPUEngine";
import {Camera} from "./core/Camera";
import {MeshRenderer} from "./core/mesh/MeshRenderer";

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