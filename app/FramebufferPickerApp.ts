import {WebGPUEngine} from "../core/WebGPUEngine";
import {Camera} from "../core/Camera";
import {MeshRenderer} from "../core/mesh/MeshRenderer";
import {PrimitiveMesh} from "../core/mesh/PrimitiveMesh";
import {BlinnPhongMaterial} from "../core/material";
import {Vector3, Color} from "@oasis-engine/math";
import {OrbitControl} from "../core/control";
import {PointLight} from "../core/lighting";
import {SampledTexture2D, SampledTextureCube} from "../core/texture";
import "../core/loader/Texture2DLoader"
import "../core/loader/TextureCubeLoader"
import {AssetType} from "../core/asset";
import {SkyboxSubpass} from "../core/rendering/subpasses";
import {ColorPickerRenderPass} from "../core/rendering/renderpasses";
import {Renderer} from "../core/Renderer";
import {Mesh} from "../core/graphic/Mesh";

const engine = new WebGPUEngine("canvas");
engine.canvas.resizeByClientSize();
engine.init().then(() => {
    engine.resourceManager
        .load<SampledTextureCube>({
                urls: [
                    "http://192.168.31.204:8000/SkyMap/country/posx.png",
                    "http://192.168.31.204:8000/SkyMap/country/negx.png",
                    "http://192.168.31.204:8000/SkyMap/country/posy.png",
                    "http://192.168.31.204:8000/SkyMap/country/negy.png",
                    "http://192.168.31.204:8000/SkyMap/country/posz.png",
                    "http://192.168.31.204:8000/SkyMap/country/negz.png",
                ],
                type: AssetType.TextureCube
            }
        )
        .then((cubeMap) => {
            const skybox = new SkyboxSubpass(engine);
            skybox.createCuboid();
            skybox.textureCubeMap = cubeMap;
            engine.defaultRenderPass.addSubpass(skybox);
        })

    const scene = engine.sceneManager.activeScene;
    const diffuseSolidColor = scene.ambientLight.diffuseSolidColor;
    diffuseSolidColor.setValue(0.5, 0.5, 0.5, 1);
    scene.ambientLight.diffuseSolidColor = diffuseSolidColor;
    const rootEntity = scene.createRootEntity();

    // init camera
    const cameraEntity = rootEntity.createChild("camera");
    const mainCamera = cameraEntity.addComponent(Camera);
    cameraEntity.transform.setPosition(10, 10, 10);
    cameraEntity.transform.lookAt(new Vector3());
    cameraEntity.addComponent(OrbitControl)

    const colorPicker = new ColorPickerRenderPass(engine);
    colorPicker.mainCamera = mainCamera;
    colorPicker.onPick = (renderer: Renderer, mesh: Mesh) => {
        (<BlinnPhongMaterial>renderer.getMaterial()).setBaseColor(new Color(1, 1, 1, 1));
    }
    window.addEventListener("mousedown", (event) => {
        colorPicker.pick(event.offsetX, event.offsetY);
    })
    engine.renderPasses.push(colorPicker);

    // init point light
    const light = rootEntity.createChild("light");
    light.transform.setPosition(0, 10, 0);
    light.transform.lookAt(new Vector3());
    const pointLight = light.addComponent(PointLight);
    pointLight.intensity = 0.6;

    const cubeEntity = rootEntity.createChild();
    const renderer = cubeEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCuboid(engine, 1);
    engine.resourceManager
        .load<SampledTexture2D>("http://192.168.31.204:8000/Textures/wood.png")
        .then((texture) => {
            const unlit = new BlinnPhongMaterial(engine)
            unlit.baseTexture = texture;
            renderer.setMaterial(unlit);
        });

    engine.run();
});
