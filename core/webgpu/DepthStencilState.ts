export class DepthStencilState implements GPUDepthStencilState {
    depthBias: GPUDepthBias;
    depthBiasClamp: number;
    depthBiasSlopeScale: number;
    depthCompare: GPUCompareFunction;
    depthWriteEnabled: boolean;
    format: GPUTextureFormat;
    stencilBack: GPUStencilFaceState;
    stencilFront: GPUStencilFaceState;
    stencilReadMask: GPUStencilValue;
    stencilWriteMask: GPUStencilValue;
}