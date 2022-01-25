import {TypedArray} from "../base/Constant";

/**
 * Buffer.
 */
export class Buffer {
    _nativeBuffer: GPUBuffer;

    private _byteLength: number;

    /**
     * Byte length.
     */
    get byteLength(): number {
        return this._byteLength;
    }

    /**
     * Create Buffer.
     * @param engine - Engine
     * @param byteLength - Byte length
     * @param bufferUsage - Buffer usage
     */
    constructor(engine: GPUDevice, byteLength: number, bufferUsage: GPUBufferUsageFlags);

    /**
     * Create Buffer.
     * @param device - Device
     * @param data - Byte
     * @param bufferUsage - Buffer usage
     */
    constructor(device: GPUDevice, data: ArrayBuffer | ArrayBufferView, bufferUsage: GPUBufferUsageFlags);

    constructor(device: GPUDevice,
                byteLengthOrData: number | ArrayBuffer | ArrayBufferView,
                bufferUsage: GPUBufferUsageFlags) {
        if (typeof byteLengthOrData === "number") {
            this._byteLength = byteLengthOrData;
            this._nativeBuffer = device.createBuffer({
                size: this._byteLength,
                usage: bufferUsage,
                mappedAtCreation: true
            });
        } else {
            this._byteLength = byteLengthOrData.byteLength;
            this._nativeBuffer = device.createBuffer({
                size: this._byteLength,
                usage: bufferUsage,
                mappedAtCreation: true
            });
        }
    }

    map(mode: GPUMapModeFlags) {
        return this._nativeBuffer.mapAsync(mode);
    }

    /**
     * Set buffer data.
     * @param typedArray - Input buffer data
     */
    setData(typedArray: TypedArray): void;

    /**
     * Set buffer data.
     * @param typedArray - Input buffer data
     * @param bufferByteOffset - buffer byte offset
     */
    setData(typedArray: TypedArray, bufferByteOffset: number): void;

    /**
     * Set buffer data.
     * @param typedArray - Input buffer data
     * @param bufferByteOffset - Buffer byte offset
     * @param dataOffset - Buffer byte offset
     * @param dataLength - Data length
     */
    setData(typedArray: TypedArray, bufferByteOffset: number, dataOffset: number, dataLength?: number): void;

    setData(typedArray: TypedArray,
            bufferByteOffset: number = 0,
            dataOffset: number = 0,
            dataLength?: number): void {
        // TypeArray is BYTES_PER_ELEMENT, unTypeArray is 1
        const byteSize = (<Uint8Array>typedArray).BYTES_PER_ELEMENT || 1;
        const dataByteLength = dataLength ? byteSize * dataLength : typedArray.byteLength;

        let constructor = typedArray.constructor as new (buffer: ArrayBuffer) => TypedArray;

        let view = new constructor(this._nativeBuffer.getMappedRange(dataOffset, dataByteLength));

        view.set(typedArray, bufferByteOffset);

        this._nativeBuffer.unmap();
    }

    /**
     * @override
     * Destroy.
     */
    _onDestroy() {
    }
}