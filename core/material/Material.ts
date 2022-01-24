import {CloneManager} from "../clone/CloneManager";
import {RenderQueueType} from "./enums/RenderQueueType";
import {RenderState} from "../shader/state/RenderState";
import {Shader} from "../shader/Shader";
import {ShaderData} from "../shader/ShaderData";
import {ShaderDataGroup} from "../shader/ShaderDataGroup";

/**
 * Material.
 */
export class Material {
    /** Name. */
    name: string;
    /** Shader used by the material. */
    shader: Shader;
    /** Render queue type. */
    renderQueueType: RenderQueueType = RenderQueueType.Opaque;
    /** Shader data. */
    readonly shaderData: ShaderData = new ShaderData(ShaderDataGroup.Material);
    /** Render state. */
    readonly renderState: RenderState = new RenderState(); // todo: later will as a part of shaderData when shader effect frame is OK, that is more powerful and flexible.

    /**
     * Create a material instance.
     * @param shader - Shader used by the material
     */
    constructor(shader: Shader) {
        this.shader = shader;
    }

    /**
     * Clone and return the instance.
     */
    clone(): Material {
        const dest = new Material(this.shader);
        this.cloneTo(dest);
        return dest;
    }

    /**
     * Clone to the target material.
     * @param target - target material
     */
    cloneTo(target: Material): void {
        target.shader = this.shader;
        target.renderQueueType = this.renderQueueType;
        this.shaderData.cloneTo(target.shaderData);
        CloneManager.deepCloneObject(this.renderState, target.renderState);
    }
}
