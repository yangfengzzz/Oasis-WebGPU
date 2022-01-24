import {Canvas} from "./Canvas";

export class View {
    private _format:GPUTextureFormat;
    private _device:GPUDevice;
    private _canvas:Canvas;

    private _descriptor: GPUTextureDescriptor;

    constructor(format:GPUTextureFormat, device: GPUDevice, canvas:Canvas) {
        this._format = format;
        this._device = device;
        this._canvas = canvas;

        const width = this._canvas.width;
        const height = this._canvas.height;
        let colorTexture = device.createTexture({
            size: {
                width,
                height,
                depthOrArrayLayers: 1
            },
            sampleCount: 4,
            format: format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        let colorAttachmentView = colorTexture.createView();

        let depthStencilTexture = device.createTexture({
            size: {
                width,
                height,
                depthOrArrayLayers: 1
            },
            sampleCount: 4,
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        let depthStencilAttachmentView = depthStencilTexture.createView();
    }
}