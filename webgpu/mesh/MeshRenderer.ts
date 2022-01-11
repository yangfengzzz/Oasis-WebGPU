import {BoundingBox, Matrix, Vector3} from "@oasis-engine/math";
import {Camera} from "../Camera";
import {ignoreClone} from "../clone/CloneManager";
import {ICustomClone} from "../clone/ComponentCloner";
import {Entity} from "../Entity";
import {Mesh} from "../graphic/Mesh";
import {Renderer} from "../Renderer";
import {UpdateFlag} from "../UpdateFlag";
import {ShaderProgram} from "../shader/ShaderProgram";
import vxCode from "../../shader/vertex.wgsl";
import fxCode from "../../shader/fragment.wgsl";
import {PrimitiveMesh} from "./PrimitiveMesh";

const triangleMVMatrix = new Matrix;
const squareMVMatrix = new Matrix();
const pMatrix = new Matrix();
Matrix.perspective(45, document.body.clientWidth / document.body.clientHeight, 0.1, 100, pMatrix);

const backgroundColor = {r: 0.4, g: 0.4, b: 0.4, a: 1.0};

let lastTime = 0, rTri = 0, rSquare = 0;
const animate = () => {
    let timeNow = performance.now();
    if (lastTime != 0) {
        let elapsed = timeNow - lastTime;
        rTri += (Math.PI / 180 * 90 * elapsed) / 1000.0;
        rSquare += (Math.PI / 180 * 75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

/**
 * MeshRenderer Component.
 */
export class MeshRenderer extends Renderer implements ICustomClone {
    @ignoreClone
    private _mesh: Mesh;
    @ignoreClone
    private _meshUpdateFlag: UpdateFlag;

    // todo delete
    shaderProgram: ShaderProgram;

    /**
     * @internal
     */
    constructor(entity: Entity) {
        super(entity);
        // todo delete
        this.shaderProgram = new ShaderProgram(this.engine, vxCode, fxCode);
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
        animate();
        triangleMVMatrix.identity().translate(new Vector3(-1.5, 0.0, -7.0)).multiply(new Matrix().rotateAxisAngle(new Vector3(0, 1, 0), rTri));
        squareMVMatrix.identity().translate(new Vector3(1.5, 0.0, -7.0)).multiply(new Matrix().rotateAxisAngle(new Vector3(1, 0, 0), rSquare));

        //--------------------------------------------------------------------------------------------------------------
        this.engine._hardwareRenderer.InitRenderPass(backgroundColor);

        this.engine._hardwareRenderer.createBindGroupLayout();

        this.engine._hardwareRenderer.createUniformBuffer(this.engine, pMatrix.elements, triangleMVMatrix.elements);
        const box = PrimitiveMesh.createCuboid(this.engine, 1);
        this.engine._hardwareRenderer.drawPrimitive(box, box.subMesh, this.shaderProgram);

        this.engine._hardwareRenderer.createUniformBuffer(this.engine,  pMatrix.elements, squareMVMatrix.elements);
        const sphere = PrimitiveMesh.createSphere(this.engine, 1, 50);
        this.engine._hardwareRenderer.drawPrimitive(sphere, sphere.subMesh, this.shaderProgram);

        this.engine._hardwareRenderer.Present();
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