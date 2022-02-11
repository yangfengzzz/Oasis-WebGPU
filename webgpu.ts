import {WebGPUEngine} from "./core/WebGPUEngine";
import {Camera} from "./core/Camera";
import {MeshRenderer} from "./core/mesh/MeshRenderer";
import {PrimitiveMesh} from "./core/mesh/PrimitiveMesh";
import {UnlitMaterial} from "./core/material";
import {Vector3} from "@oasis-engine/math";
import {Script} from "./core/Script";
import {OrbitControl} from "./core/control";

class MoveScript extends Script {
    private _rTri = 0

    onUpdate(deltaTime: number) {
        this._rTri += 90 * deltaTime / 1000.0;
        this.entity.transform.setRotation(0, this._rTri, 0);
    }
}

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
    cameraEntity.addComponent(OrbitControl)

    const cubeEntity = rootEntity.createChild();
    cubeEntity.addComponent(MoveScript);
    const renderer = cubeEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCuboid(engine, 1);
    renderer.setMaterial(new UnlitMaterial(engine));

    const sphereEntity = rootEntity.createChild();
    sphereEntity.transform.setPosition(0, 5, 0);
    sphereEntity.addComponent(MoveScript);
    const sphereRenderer = sphereEntity.addComponent(MeshRenderer);
    sphereRenderer.mesh = PrimitiveMesh.createSphere(engine, 1);
    sphereRenderer.setMaterial(new UnlitMaterial(engine));

    engine.run();
});
