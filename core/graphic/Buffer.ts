import {RefObject} from "../asset/RefObject";
import {Engine} from "../Engine";
import {TypedArray} from "../base/Constant";
import {BufferDescriptor} from "../webgpu";

/**
 * Buffer.
 */
export class Buffer extends RefObject {
    private static _bufferDescriptor: BufferDescriptor = new BufferDescriptor();
    private readonly _nativeBuffer: GPUBuffer;
    private readonly _byteLength: number;

    /**
     * Byte length.
     */
    get byteLength(): number {
        return this._byteLength;
    }

    get buffer(): GPUBuffer {
        return this._nativeBuffer;
    }

    /**
     * Create Buffer.
     * @param engine - Engine
     * @param byteLength - Byte length
     * @param bufferUsage - Buffer usage
     */
    constructor(engine: Engine, byteLength: number, bufferUsage: GPUBufferUsageFlags);

    /**
     * Create Buffer.
     * @param engine - Engine
     * @param data - Byte
     * @param bufferUsage - Buffer usage
     */
    constructor(engine: Engine, data: ArrayBuffer | ArrayBufferView, bufferUsage: GPUBufferUsageFlags);

    constructor(engine: Engine,
                byteLengthOrData: number | ArrayBuffer | ArrayBufferView,
                bufferUsage: GPUBufferUsageFlags) {
        super(engine);
        const bufferDescriptor = Buffer._bufferDescriptor;
        if (typeof byteLengthOrData === "number") {
            this._byteLength = byteLengthOrData;
        } else {
            this._byteLength = byteLengthOrData.byteLength;
        }

        bufferDescriptor.usage = bufferUsage;
        bufferDescriptor.size = this._byteLength;
        this._nativeBuffer = engine.device.createBuffer(bufferDescriptor);
    }

    map(mode: GPUMapModeFlags): Promise<undefined> {
        return this._nativeBuffer.mapAsync(mode);
    }

    uploadData(typedArray: TypedArray, bufferByteOffset: number = 0, dataOffset: number = 0, dataLength: number = 0) {
        this.engine.device.queue.writeBuffer(this._nativeBuffer, bufferByteOffset, typedArray, dataOffset, dataLength)
    }

    protected _onDestroy(): void {
    }
}
