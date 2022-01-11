/**
 * Platform primitive interface.
 */
export interface IPlatformPrimitive {
    /**
     * Draw primitive.
     * @param renderPassEncoder - Encoder
     * @param tech - Shader
     * @param subPrimitive - Sub primitive
     */
    draw(renderPassEncoder: GPURenderPassEncoder, tech: any, subPrimitive: any): void;

    /**
     * Destroy.
     */
    destroy(): void;
}
