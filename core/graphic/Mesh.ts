import {BoundingBox} from "@oasis-engine/math";
import {MeshTopology} from "./enums/MeshTopology";
import {IndexBufferBinding} from "./IndexBufferBinding";
import {SubMesh} from "./SubMesh";
import {VertexBufferBinding} from "./VertexBufferBinding";
import {VertexElement} from "./VertexElement";
import {UpdateFlag} from "../UpdateFlag";
import {UpdateFlagManager} from "../UpdateFlagManager";

/**
 * Mesh.
 */
export abstract class Mesh {
    /** Name. */
    name: string;
    /** The bounding volume of the mesh. */
    readonly bounds: BoundingBox = new BoundingBox();

    _vertexElementMap: Record<string, VertexElement> = {};

    /** @internal */
    _instanceCount: number = 0;
    /** @internal */
    _vertexBufferBindings: VertexBufferBinding[] = [];
    /** @internal */
    _indexBufferBinding: IndexBufferBinding = null;
    /** @internal */
    _vertexElements: VertexElement[] = [];

    private _subMeshes: SubMesh[] = [];
    private _updateFlagManager: UpdateFlagManager = new UpdateFlagManager();

    protected _device: GPUDevice;

    /**
     * First sub-mesh. Rendered using the first material.
     */
    get subMesh(): SubMesh | null {
        return this._subMeshes[0] || null;
    }

    /**
     * A collection of sub-mesh, each sub-mesh can be rendered with an independent material.
     */
    get subMeshes(): Readonly<SubMesh[]> {
        return this._subMeshes;
    }

    /**
     * Create mesh.
     * @param device - Device
     * @param name - Mesh name
     */
    protected constructor(device: GPUDevice, name?: string) {
        this.name = name;
        this._device = device;
    }

    /**
     * Add sub-mesh, each sub-mesh can correspond to an independent material.
     * @param subMesh - Start drawing offset, if the index buffer is set, it means the offset in the index buffer, if not set, it means the offset in the vertex buffer
     * @returns Sub-mesh
     */
    addSubMesh(subMesh: SubMesh): SubMesh;

    /**
     * Add sub-mesh, each sub-mesh can correspond to an independent material.
     * @param start - Start drawing offset, if the index buffer is set, it means the offset in the index buffer, if not set, it means the offset in the vertex buffer
     * @param count - Drawing count, if the index buffer is set, it means the count in the index buffer, if not set, it means the count in the vertex buffer
     * @param topology - Drawing topology, default is MeshTopology.Triangles
     * @returns Sub-mesh
     */
    addSubMesh(start: number, count: number, topology?: MeshTopology): SubMesh;

    addSubMesh(
        startOrSubMesh: number | SubMesh,
        count?: number,
        topology: MeshTopology = MeshTopology.Triangles
    ): SubMesh {
        if (typeof startOrSubMesh === "number") {
            startOrSubMesh = new SubMesh(startOrSubMesh, count, topology);
        }
        this._subMeshes.push(startOrSubMesh);
        return startOrSubMesh;
    }

    /**
     * Remove sub-mesh.
     * @param subMesh - Sub-mesh needs to be removed
     */
    removeSubMesh(subMesh: SubMesh): void {
        const subMeshes = this._subMeshes;
        const index = subMeshes.indexOf(subMesh);
        if (index !== -1) {
            subMeshes.splice(index, 1);
        }
    }

    /**
     * Clear all sub-mesh.
     */
    clearSubMesh(): void {
        this._subMeshes.length = 0;
    }

    /**
     * Register update flag, update flag will be true if the vertex element changes.
     * @returns Update flag
     */
    registerUpdateFlag(): UpdateFlag {
        return this._updateFlagManager.register();
    }

    /**
     * @override
     */
    _addRefCount(value: number): void {
        // super._addRefCount(value);
        // const vertexBufferBindings = this._vertexBufferBindings;
        // for (let i = 0, n = vertexBufferBindings.length; i < n; i++) {
        //     vertexBufferBindings[i]._buffer._addRefCount(value);
        // }
    }

    /**
     * @override
     * Destroy.
     */
    _onDestroy(): void {
        this._vertexBufferBindings = null;
        this._indexBufferBinding = null;
        this._vertexElements = null;
        this._vertexElementMap = null;
    }

    protected _setVertexElements(elements: VertexElement[]): void {
        this._clearVertexElements();
        for (let i = 0, n = elements.length; i < n; i++) {
            this._addVertexElement(elements[i]);
        }
    }

    protected _setVertexBufferBinding(index: number, binding: VertexBufferBinding): void {
        // if (this._getRefCount() > 0) {
        //     const lastBinding = this._vertexBufferBindings[index];
        //     lastBinding && lastBinding._buffer._addRefCount(-1);
        //     binding._buffer._addRefCount(1);
        // }
        this._vertexBufferBindings[index] = binding;
    }

    protected _setIndexBufferBinding(binding: IndexBufferBinding | null): void {
        if (binding) {
            this._indexBufferBinding = binding;
        } else {
            this._indexBufferBinding = null;
        }
    }

    private _clearVertexElements(): void {
        this._vertexElements.length = 0;
        const vertexElementMap = this._vertexElementMap;
        for (const k in vertexElementMap) {
            delete vertexElementMap[k];
        }
    }

    private _addVertexElement(element: VertexElement): void {
        const {semantic} = element;
        this._vertexElementMap[semantic] = element;
        this._vertexElements.push(element);
        this._updateFlagManager.distribute();
    }
}