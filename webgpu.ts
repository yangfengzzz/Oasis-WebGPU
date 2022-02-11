import {WebGPUEngine} from "./core/WebGPUEngine";
import {Camera} from "./core/Camera";
import {MeshRenderer} from "./core/mesh/MeshRenderer";
import {PrimitiveMesh} from "./core/mesh/PrimitiveMesh";
import {BlinnPhongMaterial, UnlitMaterial} from "./core/material";
import {Vector3, Color} from "@oasis-engine/math";
import {Script} from "./core/Script";
import {OrbitControl} from "./core/control";
import {PointLight} from "./core/lighting";

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
    const diffuseSolidColor = scene.ambientLight.diffuseSolidColor;
    diffuseSolidColor.setValue(0.5, 0.5, 0.5, 1);
    scene.ambientLight.diffuseSolidColor = diffuseSolidColor;
    const rootEntity = scene.createRootEntity();

    // init camera
    const cameraEntity = rootEntity.createChild("camera");
    cameraEntity.addComponent(Camera);
    cameraEntity.transform.setPosition(10, 10, 10);
    cameraEntity.transform.lookAt(new Vector3());
    cameraEntity.addComponent(OrbitControl)

    // init point light
    const light = rootEntity.createChild("light");
    light.transform.setPosition(0, 10, 0);
    light.transform.lookAt(new Vector3());
    const pointLight = light.addComponent(PointLight);
    pointLight.intensity = 0.6;

    const cubeEntity = rootEntity.createChild();
    cubeEntity.addComponent(MoveScript);
    const renderer = cubeEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCuboid(engine, 1);
    const material = new BlinnPhongMaterial(engine);
    material.setBaseColor(new Color(0.7, 0.5, 0.4, 1));
    renderer.setMaterial(material);

    const sphereEntity = rootEntity.createChild();
    sphereEntity.transform.setPosition(0, 5, 0);
    sphereEntity.addComponent(MoveScript);
    const sphereRenderer = sphereEntity.addComponent(MeshRenderer);
    sphereRenderer.mesh = PrimitiveMesh.createSphere(engine, 1);
    sphereRenderer.setMaterial(new BlinnPhongMaterial(engine));

    engine.run();
});
