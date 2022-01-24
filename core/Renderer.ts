import { BoundingBox, Matrix, Vector3 } from "@oasis-engine/math";
import { Camera } from "./Camera";
import { deepClone, ignoreClone, shallowClone } from "./clone/CloneManager";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { UpdateFlag } from "./UpdateFlag";

/**
 * Renderable component.
 */
export abstract class Renderer extends Component {
    /** Whether it is clipped by the frustum, needs to be turned on camera.enableFrustumCulling. */
    @ignoreClone
    isCulled: boolean = false;

    /** @internal */
    @ignoreClone
    _distanceForSort: number;
    /** @internal */
    @ignoreClone
    _onUpdateIndex: number = -1;
    /** @internal */
    @ignoreClone
    _rendererIndex: number = -1;

    @ignoreClone
    protected _overrideUpdate: boolean = false;

    @ignoreClone
    private _transformChangeFlag: UpdateFlag;
    @ignoreClone
    private _mvMatrix: Matrix = new Matrix();
    @ignoreClone
    private _mvpMatrix: Matrix = new Matrix();
    @ignoreClone
    private _mvInvMatrix: Matrix = new Matrix();
    @ignoreClone
    private _normalMatrix: Matrix = new Matrix();
    @ignoreClone
    private _materialsInstanced: boolean[] = [];

    /**
     * @internal
     */
    protected constructor(entity: Entity) {
        super(entity);
    }

    update(deltaTime: number): void {}

    _onEnable(): void {
        const componentsManager = this.engine._componentsManager;
        if (this._overrideUpdate) {
            componentsManager.addOnUpdateRenderers(this);
        }
        componentsManager.addRenderer(this);
    }

    _onDisable(): void {
        const componentsManager = this.engine._componentsManager;
        if (this._overrideUpdate) {
            componentsManager.removeOnUpdateRenderers(this);
        }
        componentsManager.removeRenderer(this);
    }

    /**
     * @internal
     */
    abstract _render(camera: Camera): void;

    /**
     * @internal
     */
    _onDestroy(): void {
        const flag = this._transformChangeFlag;
        if (flag) {
            flag.destroy();
            this._transformChangeFlag = null;
        }

        // this.shaderData._addRefCount(-1);
        //
        // for (let i = 0, n = this._materials.length; i < n; i++) {
        //     this._materials[i]._addRefCount(-1);
        // }
    }
}