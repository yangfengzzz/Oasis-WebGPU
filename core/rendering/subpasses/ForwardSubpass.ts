import {Subpass} from "../Subpass";
import {Scene} from "../../Scene";
import {Camera} from "../../Camera";
import {RenderPipelineDescriptor} from "../../webgpu/RenderPipelineDescriptor";
import {PipelineLayoutDescriptor} from "../../webgpu/PipelineLayoutDescriptor";
import {DepthStencilState, FragmentState, MultisampleState, PrimitiveState, VertexState} from "../../webgpu/state";
import {Matrix, Vector3} from "@oasis-engine/math";
import {PrimitiveMesh} from "../../mesh/PrimitiveMesh";
import {ShaderProgram} from "../../shader/ShaderProgram";
import vxCode from "../../../shader/vertex.wgsl";
import fxCode from "../../../shader/fragment.wgsl";
import {Buffer} from "../../graphic/Buffer";
import {SubMesh} from "../../graphic/SubMesh";
import {
    BindGroupLayoutDescriptor,
    BindGroupLayoutEntry,
    BufferBindingLayout
} from "../../webgpu/BindGroupLayoutDescriptor";
import {BindGroupDescriptor, BindGroupEntry, BufferBinding} from "../../webgpu/BindGroupDescriptor";
import {ColorTargetState} from "../../webgpu/state/FragmentState";
import {VertexAttribute, VertexBufferLayout} from "../../webgpu/state/VertexState";
import {ModelMesh} from "../../mesh/ModelMesh";
import {Engine} from "../../Engine";

const triangleMVMatrix = new Matrix;
const squareMVMatrix = new Matrix();
const pMatrix = new Matrix();
Matrix.perspective(45, document.body.clientWidth / document.body.clientHeight, 0.1, 100, pMatrix);

let lastTime = 0, rTri = 0, rSquare = 0;
const animate = () => {
    let timeNow = performance.now();
    if (lastTime != 0) {
        let elapsed = timeNow - lastTime;
        rTri += (Math.PI / 180 * 90 * elapsed) / 1000.0;
        rSquare += (Math.PI / 180 * 75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

export class ForwardSubpass extends Subpass {
    private _forwardPipelineDescriptor: RenderPipelineDescriptor = new RenderPipelineDescriptor();
    private _depthStencilState = new DepthStencilState();
    private _fragment = new FragmentState();
    private _primitive = new PrimitiveState();
    private _multisample = new MultisampleState();
    private _vertex = new VertexState();

    private _bindGroupLayoutDescriptor = new BindGroupLayoutDescriptor();
    private _uniformGroupLayout: GPUBindGroupLayout;
    private _bindGroupDescriptor = new BindGroupDescriptor();
    private _uniformBindGroup: GPUBindGroup;

    private _pipelineLayoutDescriptor = new PipelineLayoutDescriptor();
    private _pipelineLayout: GPUPipelineLayout;
    private _renderPipeline: GPURenderPipeline;

    private _shaderProgram: ShaderProgram;
    private _pBuffer: Buffer;
    private _mvBuffer: Buffer;
    private _box: ModelMesh;

    constructor(engine: Engine) {
        super(engine);
        const device = this._engine.device;
        this._shaderProgram = new ShaderProgram(device, vxCode, fxCode);
        this._box = PrimitiveMesh.createCuboid(this._engine, 1);
        {
            this._bindGroupLayoutDescriptor.entries.length = 2;
            const uniform1 = new BindGroupLayoutEntry();
            uniform1.binding = 0;
            uniform1.visibility = GPUShaderStage.VERTEX;
            uniform1.buffer = new BufferBindingLayout();
            uniform1.buffer.type = 'uniform';
            this._bindGroupLayoutDescriptor.entries[0] = uniform1;
            const uniform2 = new BindGroupLayoutEntry();
            uniform2.binding = 1;
            uniform2.visibility = GPUShaderStage.VERTEX;
            uniform2.buffer = new BufferBindingLayout();
            uniform2.buffer.type = 'uniform';
            this._bindGroupLayoutDescriptor.entries[1] = uniform2;
            this._uniformGroupLayout = device.createBindGroupLayout(this._bindGroupLayoutDescriptor);
        }
        {
            this._pBuffer = new Buffer(this._engine, 64, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
            this._pBuffer._nativeBuffer.unmap();
            this._mvBuffer = new Buffer(this._engine, 64, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
            this._mvBuffer._nativeBuffer.unmap();
            this._bindGroupDescriptor.layout = this._uniformGroupLayout;
            this._bindGroupDescriptor.entries.length = 2;
            const uniform1 = new BindGroupEntry();
            uniform1.binding = 0;
            const uniformBuffer1 = new BufferBinding();
            uniformBuffer1.buffer = this._pBuffer._nativeBuffer;
            uniform1.resource = uniformBuffer1;
            this._bindGroupDescriptor.entries[0] = uniform1;
            const uniform2 = new BindGroupEntry();
            uniform2.binding = 1;
            const uniformBuffer2 = new BufferBinding();
            uniformBuffer2.buffer = this._mvBuffer._nativeBuffer;
            uniform2.resource = uniformBuffer2;
            this._bindGroupDescriptor.entries[1] = uniform2;
            this._uniformBindGroup = device.createBindGroup(this._bindGroupDescriptor);
        }
        this._forwardPipelineDescriptor.depthStencil = this._depthStencilState;
        this._forwardPipelineDescriptor.fragment = this._fragment;
        this._forwardPipelineDescriptor.primitive = this._primitive;
        this._forwardPipelineDescriptor.multisample = this._multisample;
        this._forwardPipelineDescriptor.vertex = this._vertex;
        this._forwardPipelineDescriptor.label = "Forward Pipeline";
        {
            this._pipelineLayoutDescriptor.bindGroupLayouts.length = 1;
            this._pipelineLayoutDescriptor.bindGroupLayouts[0] = this._uniformGroupLayout;
            this._pipelineLayout = device.createPipelineLayout(this._pipelineLayoutDescriptor);
            this._forwardPipelineDescriptor.layout = this._pipelineLayout;

            this._vertex.module = this._shaderProgram.vertexShader;
            this._vertex.entryPoint = 'main';

            this._fragment.module = this._shaderProgram.fragmentShader;
            this._fragment.entryPoint = 'main';
            this._fragment.targets.length = 1;
            const colorTargetState = new ColorTargetState();
            colorTargetState.format = this._engine.renderContext.drawableTextureFormat();
            this._fragment.targets[0] = colorTargetState;

            this._primitive.topology = 'triangle-list';

            this._depthStencilState.depthWriteEnabled = true;
            this._depthStencilState.depthCompare = 'less';
            this._depthStencilState.format = this._engine.renderContext.depthStencilTextureFormat();

            this._multisample.count = 1;

            this._bindVertexAttrib(this._box);
            this._renderPipeline = device.createRenderPipeline(this._forwardPipelineDescriptor);
        }
    }

    prepare(): void {
    }

    draw(scene: Scene, camera: Camera, renderPassEncoder: GPURenderPassEncoder): void {
        renderPassEncoder.pushDebugGroup("Draw Element");
        renderPassEncoder.setViewport(0, 0, this._engine.canvas.width, this._engine.canvas.height, 0, 1);
        this._drawMeshes(renderPassEncoder);
        renderPassEncoder.popDebugGroup();
    }

    _drawMeshes(renderPassEncoder: GPURenderPassEncoder): void {
        animate();
        triangleMVMatrix.identity().translate(new Vector3(-1.5, 0.0, -7.0)).multiply(new Matrix().rotateAxisAngle(new Vector3(0, 1, 0), rTri));
        squareMVMatrix.identity().translate(new Vector3(1.5, 0.0, -7.0)).multiply(new Matrix().rotateAxisAngle(new Vector3(1, 0, 0), rSquare));
        this._updateUniformBuffer(pMatrix.elements, triangleMVMatrix.elements, renderPassEncoder);

        this._drawElement(renderPassEncoder, this._box, this._box.subMesh);
    }

    private _drawElement(renderPassEncoder: GPURenderPassEncoder, primitive: ModelMesh, subMesh: SubMesh) {
        renderPassEncoder.setPipeline(this._renderPipeline);
        renderPassEncoder.setVertexBuffer(0, primitive._vertexBufferBindings[0]._buffer._nativeBuffer);
        renderPassEncoder.setIndexBuffer(primitive._indexBufferBinding.buffer._nativeBuffer, "uint32");
        renderPassEncoder.drawIndexed(subMesh.count, 1, subMesh.start, 0, 0);
    }

    private _updateUniformBuffer(pArray: Float32Array, mvArray: Float32Array, commandEncoder: GPURenderPassEncoder) {
        this._engine.device.queue.writeBuffer(this._pBuffer._nativeBuffer, 0, pArray);
        this._engine.device.queue.writeBuffer(this._mvBuffer._nativeBuffer, 0, mvArray);
        commandEncoder.setBindGroup(0, this._uniformBindGroup);
    }

    private _bindVertexAttrib(primitive: ModelMesh) {
        const attributes = primitive._vertexElements;

        const attrs: VertexAttribute[] = [];
        attrs.length = attributes.length;
        for (let i = 0; i < attributes.length; i++) {
            const attr = new VertexAttribute();
            attr.shaderLocation = i;
            attr.offset = attributes[i].offset;
            attr.format = attributes[i].format;
            attrs[i] = attr;
        }

        this._vertex.buffers.length = 1;
        const vertexBufferLayout = new VertexBufferLayout();
        vertexBufferLayout.arrayStride = primitive._vertexBufferBindings[0].stride;
        vertexBufferLayout.attributes = attrs;
        vertexBufferLayout.stepMode = 'vertex';
        this._vertex.buffers[0] = vertexBufferLayout;
    }
}