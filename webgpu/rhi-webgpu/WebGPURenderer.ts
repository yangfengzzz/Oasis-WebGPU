import {Canvas, IHardwareRenderer, Logger, WebCanvas} from "oasis-engine";
import {Mesh} from "../graphic/Mesh";
import {SubMesh} from "../graphic/SubMesh";
import {IPlatformPrimitive} from "./IPlatformPrimitive";
import {GPUPrimitive} from "./GPUPrimitive";
import {Buffer} from "../graphic/Buffer";
import {Engine} from "../Engine";
import {ShaderProgram} from "../shader/ShaderProgram";

/**
 * WebGPU renderer.
 */
export class WebGPURenderer implements IHardwareRenderer {
    public canvas: Canvas;

    public adapter: GPUAdapter;

    public device: GPUDevice;

    public context: GPUCanvasContext;

    public format: GPUTextureFormat = 'bgra8unorm';

    public commandEncoder: GPUCommandEncoder;

    public renderPassEncoder: GPURenderPassEncoder;

    public uniformGroupLayout: GPUBindGroupLayout;

    private _clearColor: GPUColorDict;

    public colorAttachmentView: GPUTextureView;

    public depthStencilAttachmentView: GPUTextureView;

    init(canvas: Canvas) {
        this.canvas = canvas;
        return this.InitWebGPU(<WebCanvas>canvas).then(({colorAttachmentView, depthStencilAttachmentView}) => {
            this.colorAttachmentView = colorAttachmentView;
            this.depthStencilAttachmentView = depthStencilAttachmentView;
        });
    }

    public async InitWebGPU(canvas: WebCanvas) {
        this.adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });

        this.device = await this.adapter.requestDevice();

        this.context = canvas._webCanvas.getContext('webgpu') as GPUCanvasContext;
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.format = this.context.getPreferredFormat(this.adapter);

        this.context.configure({
            device: this.device,
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        let colorTexture = this.device.createTexture({
            size: {
                width,
                height,
                depthOrArrayLayers: 1
            },
            sampleCount: 4,
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        let colorAttachmentView = colorTexture.createView();

        let depthStencilTexture = this.device.createTexture({
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

        // @ts-ignore
        return Promise.resolve({colorAttachmentView, depthStencilAttachmentView});
    }

    public InitRenderPass(clearColor: GPUColorDict) {
        this.commandEncoder = this.device.createCommandEncoder();
        let renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [{
                view: this.colorAttachmentView,
                resolveTarget: this.context.getCurrentTexture().createView(),
                loadValue: clearColor,
                storeOp: 'store'
            }],

            depthStencilAttachment: {
                view: this.depthStencilAttachmentView,
                depthLoadValue: 1.0,
                depthStoreOp: 'store',
                stencilLoadValue: 0,
                stencilStoreOp: 'store'
            }
        }

        this.renderPassEncoder = this.commandEncoder.beginRenderPass(renderPassDescriptor);

        if (!this._clearColor) {
            this._clearColor = clearColor;
        }

        this.renderPassEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
    }

    createBindGroupLayout() {
        this.uniformGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });
    }

    public createUniformBuffer(engine: Engine, pArray: Float32Array, mvArray: Float32Array) {
        let pBuffer = new Buffer(engine, pArray, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        pBuffer.setData(pArray);
        let mvBuffer = new Buffer(engine, mvArray, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        mvBuffer.setData(mvArray);

        let uniformBindGroup = this.device.createBindGroup({
            layout: this.uniformGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: pBuffer._nativeBuffer}
                },
                {
                    binding: 1,
                    resource: {buffer: mvBuffer._nativeBuffer}
                }]
        });

        this.renderPassEncoder.setBindGroup(0, uniformBindGroup);
    }

    public Present() {
        this.renderPassEncoder.endPass();
        this.device.queue.submit([this.commandEncoder.finish()]);
    }

    //------------------------------------------------------------------------------------------------------------------
    createPlatformPrimitive(primitive: Mesh): IPlatformPrimitive {
        return new GPUPrimitive(this, primitive);
    }

    drawPrimitive(primitive: Mesh, subPrimitive: SubMesh, shaderProgram: ShaderProgram) {
        if (primitive) {
            primitive._draw(this.renderPassEncoder, shaderProgram, subPrimitive);
        } else {
            Logger.error("draw primitive failed.");
        }
    }
}