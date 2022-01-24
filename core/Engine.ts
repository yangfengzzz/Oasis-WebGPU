import {Time} from "./base";
import {WebCanvas} from "./WebCanvas";
import {EngineSettings} from "./EngineSettings";
import {ColorSpace} from "./enums/ColorSpace";
import {Entity} from "./Entity";
import {Application} from "./Application";
import {View} from "./View";

export class Engine {
    protected _canvas: WebCanvas;
    protected _activeApp: Application;

    private _settings: EngineSettings = {};
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
     * Settings of Engine.
     */
    get settings(): Readonly<EngineSettings> {
        return this._settings;
    }

    /**
     * The canvas to use for rendering.
     */
    get canvas(): WebCanvas {
        return this._canvas;
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

    constructor(canvas: WebCanvas, app:Application, settings?: EngineSettings) {
        this._canvas = canvas;
        this._activeApp = app;

        const colorSpace = settings?.colorSpace || ColorSpace.Linear;
        // colorSpace === ColorSpace.Gamma && this._macroCollection.enable(Engine._gammaMacro);
        this._settings.colorSpace = colorSpace;
    }

    /**
     * Create an entity.
     * @param name - The name of the entity
     * @returns Entity
     */
    createEntity(name?: string): Entity {
        return new Entity(name);
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
     * Execution engine loop.
     */
    run(): void {
        if (!this._isPaused) return;
        this._isPaused = false;
        this.time.reset();

        requestAnimationFrame(this._animate);
    }

    createView(adapter: GPUAdapter, device: GPUDevice):View {
        return this._canvas.createView(adapter, device);
    }

    /**
     * @brief Runs the application for one frame
     */
    update(): void {
        const time = this._time;
        const deltaTime = time.deltaTime;

        time.tick();
        this._activeApp.update(deltaTime);
    }

    /**
     * Destroy engine.
     */
    destroy(): void {

    }
}