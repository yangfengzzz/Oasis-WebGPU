import {Canvas} from "./Canvas";

export class View {
    private _format:GPUTextureFormat;
    private _device:GPUDevice;
    private _canvas:Canvas;

    private _descriptor: TextureDescriptor;

    colorAttachmentView:GPUTextureView;
    depthStencilAttachmentView:GPUTextureView;

    get device():GPUDevice {
        return this._device;
    }

    constructor(format:GPUTextureFormat, device: GPUDevice, canvas:Canvas) {
        this._format = format;
        this._device = device;
        this._canvas = canvas;

        const width = this._canvas.width;
        const height = this._canvas.height;
        this._descriptor = new TextureDescriptor();
        this._descriptor.size = {
            width,
            height,
            depthOrArrayLayers: 1
        };
        this._descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;

        this._descriptor.format = format;
        this.colorAttachmentView = device.createTexture(this._descriptor).createView();

        this._descriptor.format = 'depth24plus-stencil8';
        this.depthStencilAttachmentView = device.createTexture(this._descriptor).createView();
    }
}