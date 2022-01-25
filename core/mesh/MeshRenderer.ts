import {BoundingBox, Matrix, Vector3} from "@oasis-engine/math";
import {Camera} from "../Camera";
import {ignoreClone} from "../clone/CloneManager";
import {ICustomClone} from "../clone/ComponentCloner";
import {Entity} from "../Entity";
import {Mesh} from "../graphic/Mesh";
import {Renderer} from "../Renderer";
import {UpdateFlag} from "../UpdateFlag";

/**
 * MeshRenderer Component.
 */
export class MeshRenderer extends Renderer implements ICustomClone {
    @ignoreClone
    private _mesh: Mesh;
    @ignoreClone
    private _meshUpdateFlag: UpdateFlag;

    /**
     * @internal
     */
    constructor(entity: Entity) {
        super(entity);
    }

    /**
     * Mesh assigned to the renderer.
     */
    get mesh() {
        return this._mesh;
    }

    set mesh(mesh: Mesh) {
        const lastMesh = this._mesh;
        if (lastMesh !== mesh) {
            if (lastMesh) {
                lastMesh._addRefCount(-1);
                this._meshUpdateFlag.destroy();
            }
            if (mesh) {
                mesh._addRefCount(1);
                this._meshUpdateFlag = mesh.registerUpdateFlag();
            }
            this._mesh = mesh;
        }
    }

    /**
     * @internal
     */
    _render(camera: Camera): void {

    }

    /**
     * @internal
     * @override
     */
    _onDestroy() {
        super._onDestroy();
        const mesh = this._mesh;
        if (mesh && !mesh.destroyed) {
            mesh._addRefCount(-1);
            this._mesh = null;
        }
    }

    /**
     * @internal
     */
    _cloneTo(target: MeshRenderer): void {
        target.mesh = this._mesh;
    }

    /**
     * @override
     */
    protected _updateBounds(worldBounds: BoundingBox): void {
        const mesh = this._mesh;
        if (mesh) {
            const localBounds = mesh.bounds;
            const worldMatrix = this._entity.transform.worldMatrix;
            BoundingBox.transform(localBounds, worldMatrix, worldBounds);
        } else {
            worldBounds.min.setValue(0, 0, 0);
            worldBounds.max.setValue(0, 0, 0);
        }
    }
}