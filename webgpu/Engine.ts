import {Canvas, Logger, Time} from "oasis-engine";
import {ComponentsManager} from "./ComponentsManager";
import {ResourceManager} from "./asset/ResourceManager";
import {WebGPURenderer} from "./rhi-webgpu/WebGPURenderer";
import {SceneManager} from "./SceneManager";
import {Entity} from "./Entity";
import {Scene} from "./Scene";

/**
 * Engine.
 */
export class Engine {
    _componentsManager: ComponentsManager = new ComponentsManager();
    _hardwareRenderer: WebGPURenderer;

    protected _canvas: Canvas;
    private _resourceManager: ResourceManager = new ResourceManager(this);
    private _sceneManager: SceneManager = new SceneManager(this);
    private _vSyncCount: number = 1;
    private _targetFrameRate: number = 60;
    private _time: Time = new Time();
    private _isPaused: boolean = true;
    private _requestId: number;
    private _timeoutId: number;
    private _vSyncCounter: number = 1;
    private _targetFrameInterval: number = 1000 / 60;

    private _animate = () => {
        if (this._vSyncCount) {
            this._requestId = requestAnimationFrame(this._animate);
            if (this._vSyncCounter++ % this._vSyncCount === 0) {
                this.update();
                this._vSyncCounter = 1;
            }
        } else {
            this._timeoutId = window.setTimeout(this._animate, this._targetFrameInterval);
            this.update();
        }
    };

    /**
     * The canvas to use for rendering.
     */
    get canvas(): Canvas {
        return this._canvas;
    }

    /**
     * Get the resource manager.
     */
    get resourceManager(): ResourceManager {
        return this._resourceManager;
    }

    /**
     * Get the scene manager.
     */
    get sceneManager(): SceneManager {
        return this._sceneManager;
    }

    /**
     * Get the Time class.
     */
    get time(): Time {
        return this._time;
    }

    /**
     * Whether the engine is paused.
     */
    get isPaused(): boolean {
        return this._isPaused;
    }

    /**
     * The number of vertical synchronization means the number of vertical blanking for one frame.
     * @remarks 0 means that the vertical synchronization is turned off.
     */
    get vSyncCount(): number {
        return this._vSyncCount;
    }

    set vSyncCount(value: number) {
        this._vSyncCount = Math.max(0, Math.floor(value));
    }

    /**
     * Set the target frame rate you want to achieve.
     * @remarks
     * It only takes effect when vSyncCount = 0 (ie, vertical synchronization is turned off).
     * The larger the value, the higher the target frame rate, Number.POSITIVE_INFINITY represents the infinite target frame rate.
     */
    get targetFrameRate(): number {
        return this._targetFrameRate;
    }

    set targetFrameRate(value: number) {
        value = Math.max(0.000001, value);
        this._targetFrameRate = value;
        this._targetFrameInterval = 1000 / value;
    }

    constructor(canvas: Canvas, hardwareRenderer: WebGPURenderer) {
        this._canvas = canvas;
        this._hardwareRenderer = hardwareRenderer;

        this._sceneManager.activeScene = new Scene(this, "DefaultScene");
    }

    init() {
        return this._hardwareRenderer.init(this._canvas);
    }

    /**
     * Create an entity.
     * @param name - The name of the entity
     * @returns Entity
     */
    createEntity(name?: string): Entity {
        return new Entity(this, name);
    }

    /**
     * Pause the engine.
     */
    pause(): void {
        this._isPaused = true;
        cancelAnimationFrame(this._requestId);
        clearTimeout(this._timeoutId);
    }

    /**
     * Resume the engine.
     */
    resume(): void {
        if (!this._isPaused) return;
        this._isPaused = false;
        this.time.reset();
        requestAnimationFrame(this._animate);
    }

    /**
     * Update the engine loop manually. If you call engine.run(), you generally don't need to call this function.
     */
    update(): void {
        const time = this._time;
        const deltaTime = time.deltaTime;

        time.tick();

        const scene = this._sceneManager._activeScene;
        const componentsManager = this._componentsManager;
        if (scene) {
            componentsManager.callScriptOnStart();
            componentsManager.callScriptOnUpdate(deltaTime);
            componentsManager.callAnimationUpdate(deltaTime);
            componentsManager.callScriptOnLateUpdate(deltaTime);

            this._render(scene);
        }

        this._componentsManager.callComponentDestroy();
    }

    /**
     * Execution engine loop.
     */
    run(): void {
        this.resume();
    }

    _render(scene: Scene): void {
        const cameras = scene._activeCameras;
        const componentsManager = this._componentsManager;
        const deltaTime = this.time.deltaTime;
        componentsManager.callRendererOnUpdate(deltaTime);

        if (cameras.length > 0) {
            // Sort on priority
            cameras.sort((camera1, camera2) => camera1.priority - camera2.priority);
            for (let i = 0, l = cameras.length; i < l; i++) {
                const camera = cameras[i];
                const cameraEntity = camera.entity;
                if (camera.enabled && cameraEntity.isActiveInHierarchy) {
                    componentsManager.callCameraOnBeginRender(camera);
                    camera.render();
                    componentsManager.callCameraOnEndRender(camera);
                }
            }
        } else {
            Logger.debug("NO active camera.");
        }
    }
}