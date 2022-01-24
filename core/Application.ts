import {Engine} from "./Engine";
import {View} from "./View";
import {Camera} from "./Camera";
import {Scene} from "./Scene";
import {RenderPassDescriptor} from "./webgpu/RenderPassDescriptor";
import {RenderPass} from "./rendering/RenderPass";

export class Application {
    private _adapter: GPUAdapter;
    private _device: GPUDevice;
    private _view: View;

    private _mainCamera:Camera;
    private _scene:Scene;
    private _renderPassDescriptor:RenderPassDescriptor;
    private _renderPass:RenderPass;

    /**
     * @brief Prepares the application for execution
     * @param engine The engine the application is being run on
     */
    async prepare(engine: Engine): Promise<boolean> {
        this._adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });

        this._device = await this._adapter.requestDevice();
        this._view = engine.createView(this._adapter, this._device);

        this._renderPassDescriptor = new RenderPassDescriptor();
        this._renderPassDescriptor.colorAttachments[0].storeOp = 'store';
        this._renderPassDescriptor.colorAttachments[0].loadValue = {r: 0.4, g: 0.4, b: 0.4, a: 1.0};
        this._renderPassDescriptor.colorAttachments[0].view = this._view.colorAttachmentView;
        this._renderPassDescriptor.depthStencilAttachment.depthLoadValue = 'load';
        this._renderPassDescriptor.depthStencilAttachment.stencilLoadValue = 'load';
        this._renderPassDescriptor.depthStencilAttachment.view = this._view.depthStencilAttachmentView;
        this._renderPass = new RenderPass(this._renderPassDescriptor);

        return true;
    }

    /**
     * @brief Updates the application
     * @param delta_time The time since the last update
     */
    update(delta_time: number): void {
        const commandEncoder = this._device.createCommandEncoder();
        this._renderPass.draw(commandEncoder);
        this._device.queue.submit([commandEncoder.finish()]);
    }
}