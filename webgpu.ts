import {WebGPUEngine} from "./core/WebGPUEngine";
import {Camera} from "./core/Camera";
import {MeshRenderer} from "./core/mesh/MeshRenderer";
import {PrimitiveMesh} from "./core/mesh/PrimitiveMesh";
import {BlinnPhongMaterial} from "./core/material";
import {Vector3} from "@oasis-engine/math";

const engine = new WebGPUEngine("canvas");
engine.canvas.resizeByClientSize();
engine.init().then(() => {
    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();

    // init camera
    const cameraEntity = rootEntity.createChild("camera");
    cameraEntity.addComponent(Camera);
    cameraEntity.transform.setPosition(10, 10, 10);
    cameraEntity.transform.lookAt(new Vector3());

    const cubeEntity = rootEntity.createChild();
    const renderer = cubeEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCuboid(engine, 1);
    renderer.setMaterial(new BlinnPhongMaterial(engine));

    engine.run();
});