/**
 * Vertex element.
 */
export class VertexElement {
    /** Vertex semantic. */
    readonly semantic: string;
    /** Vertex data byte offset. */
    readonly offset: number;
    /** Vertex data format. */
    readonly format: GPUVertexFormat;
    /** Vertex buffer binding index. */
    readonly bindingIndex: number;
    /** Instance cadence, the number of instances drawn for each vertex in the buffer, non-instance elements must be 0. */
    readonly instanceStepRate: number;

    /**
     * Create vertex element.
     * @param semantic - Input vertex semantic
     * @param offset - Vertex data byte offset
     * @param format - Vertex data format
     * @param bindingIndex - Vertex buffer binding index
     * @param instanceStepRate - Instance cadence, the number of instances drawn for each vertex in the buffer, non-instance elements must be 0.
     */
    constructor(semantic: string,
                offset: number,
                format: GPUVertexFormat,
                bindingIndex: number,
                instanceStepRate: number = 0) {
        this.semantic = semantic;
        this.offset = offset;
        this.format = format;
        this.bindingIndex = bindingIndex;
        this.instanceStepRate = Math.floor(instanceStepRate);
    }
}
