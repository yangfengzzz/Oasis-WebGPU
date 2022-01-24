import {Vector2, Vector3} from "@oasis-engine/math";
import {Entity} from "./Entity";
import {ComponentsManager} from "./ComponentsManager";
import {Background} from "./Background";
import {Camera} from "./Camera";
import {Logger} from "./base";

/**
 * Scene.
 */
export class Scene {
    /** Scene name. */
    name: string;

    ComponentsManager
    _componentsManager;

    /** The background of the scene. */
    readonly background: Background = new Background();

    // /** Ambient light. */
    // readonly ambientLight: AmbientLight;
    // /** Scene-related shader data. */
    // readonly shaderData: ShaderData = new ShaderData(ShaderDataGroup.Scene);

    /** @internal */
    _activeCameras: Camera[] = [];
    /** @internal */
    _isActiveInEngine: boolean = false;

    private _destroyed: boolean = false;
    private _rootEntities: Entity[] = [];
    private _device: GPUDevice;

    /**
     * Count of root entities.
     */
    get rootEntitiesCount(): number {
        return this._rootEntities.length;
    }

    /**
     * Root entity collection.
     */
    get rootEntities(): Readonly<Entity[]> {
        return this._rootEntities;
    }

    /**
     * Whether it's destroyed.
     */
    get destroyed(): boolean {
        return this._destroyed;
    }

    /**
     * Create scene.
     * @param device - WebGPU Device
     * @param name - Name
     */
    constructor(device: GPUDevice, name: string = "") {
        this._device = device;
        this.name = name;
    }

    /**
     * Create root entity.
     * @param name - Entity name
     * @returns Entity
     */
    createRootEntity(name?: string): Entity {
        const entity = new Entity(name);
        this.addRootEntity(entity);
        return entity;
    }

    /**
     * Append an entity.
     * @param entity - The root entity to add
     */
    addRootEntity(entity: Entity): void {
        const isRoot = entity._isRoot;

        // let entity become root
        if (!isRoot) {
            entity._isRoot = true;
            entity._removeFromParent();
        }

        // add or remove from scene's rootEntities
        const oldScene = entity._scene;
        if (oldScene !== this) {
            if (oldScene && isRoot) {
                oldScene._removeEntity(entity);
            }
            this._rootEntities.push(entity);
            Entity._traverseSetOwnerScene(entity, this);
        } else if (!isRoot) {
            this._rootEntities.push(entity);
        }

        // process entity active/inActive
        if (this._isActiveInEngine) {
            !entity._isActiveInHierarchy && entity._isActive && entity._processActive();
        } else {
            entity._isActiveInHierarchy && entity._processInActive();
        }
    }

    /**
     * Remove an entity.
     * @param entity - The root entity to remove
     */
    removeRootEntity(entity: Entity): void {
        if (entity._isRoot && entity._scene == this) {
            this._removeEntity(entity);
            this._isActiveInEngine && entity._processInActive();
            Entity._traverseSetOwnerScene(entity, null);
        }
    }

    /**
     * Get root entity from index.
     * @param index - Index
     * @returns Entity
     */
    getRootEntity(index: number = 0): Entity | null {
        return this._rootEntities[index];
    }

    /**
     * Find entity globally by name.
     * @param name - Entity name
     * @returns Entity
     */
    findEntityByName(name: string): Entity | null {
        const children = this._rootEntities;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.name === name) {
                return child;
            }
        }

        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            const entity = child.findByName(name);
            if (entity) {
                return entity;
            }
        }
        return null;
    }

    /**
     * Find entity globally by name,use ‘/’ symbol as a path separator.
     * @param path - Entity's path
     * @returns Entity
     */
    findEntityByPath(path: string): Entity | null {
        const splits = path.split("/").filter(Boolean);
        for (let i = 0, n = this.rootEntitiesCount; i < n; i++) {
            let findEntity = this.getRootEntity(i);
            if (findEntity.name != splits[0]) continue;
            for (let j = 1, m = splits.length; j < m; ++j) {
                findEntity = Entity._findChildByName(findEntity, splits[j]);
                if (!findEntity) break;
            }
            return findEntity;
        }
        return null;
    }

    /**
     * Destroy this scene.
     */
    destroy(): void {
        if (this._destroyed) {
            return;
        }
        // this._isActiveInEngine && (this._engine.sceneManager.activeScene = null);
        // Scene.sceneFeatureManager.callFeatureMethod(this, "destroy", [this]);
        // for (let i = 0, n = this.rootEntitiesCount; i < n; i++) {
        //     this._rootEntities[i].destroy();
        // }
        // this._rootEntities.length = 0;
        // this._activeCameras.length = 0;
        // (Scene.sceneFeatureManager as any)._objects = [];
        // this.shaderData._addRefCount(-1);
        this._destroyed = true;
    }

    /**
     * @internal
     */
    _attachRenderCamera(camera: Camera): void {
        const index = this._activeCameras.indexOf(camera);
        if (index === -1) {
            this._activeCameras.push(camera);
        } else {
            Logger.warn("Camera already attached.");
        }
    }

    /**
     * @internal
     */
    _detachRenderCamera(camera: Camera): void {
        const index = this._activeCameras.indexOf(camera);
        if (index !== -1) {
            this._activeCameras.splice(index, 1);
        }
    }

    /**
     * @internal
     */
    _processActive(active: boolean): void {
        this._isActiveInEngine = active;
        const rootEntities = this._rootEntities;
        for (let i = rootEntities.length - 1; i >= 0; i--) {
            const entity = rootEntities[i];
            if (entity._isActive) {
                active ? entity._processActive() : entity._processInActive();
            }
        }
    }

    /**
     * @internal
     */
    // _updateShaderData() {
    //     const lightMgr = this.findFeature(LightFeature);
    //     const shaderData = this.shaderData;
    //     const canvas = this.engine.canvas;
    //     const resolution = this._resolution;
    //
    //     lightMgr._updateShaderData(shaderData);
    //
    //     resolution.setValue(canvas.width, canvas.height);
    //     shaderData.setVector2(Scene._resolutionProperty, resolution);
    // }

    private _removeEntity(entity: Entity): void {
        const oldRootEntities = this._rootEntities;
        oldRootEntities.splice(oldRootEntities.indexOf(entity), 1);
    }
}
