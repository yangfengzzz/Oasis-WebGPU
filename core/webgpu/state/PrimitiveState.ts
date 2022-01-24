export class PrimitiveState implements GPUPrimitiveState {
    topology?: GPUPrimitiveTopology;
    stripIndexFormat?: GPUIndexFormat;
    frontFace?: GPUFrontFace;
    cullMode?: GPUCullMode;
    unclippedDepth?: boolean;

    clone(): PrimitiveState {
        return this.cloneTo(new PrimitiveState());
    }

    cloneTo(state: PrimitiveState): PrimitiveState {
        state.topology = this.topology;
        state.stripIndexFormat = this.stripIndexFormat;
        state.frontFace = this.frontFace;
        state.cullMode = this.cullMode;
        state.unclippedDepth = this.unclippedDepth;
        return state;
    }
}