export class MultisampleState implements GPUMultisampleState {
    count?: GPUSize32;
    mask?: GPUSampleMask;
    alphaToCoverageEnabled?: boolean;

    clone(): MultisampleState {
        return this.cloneTo(new MultisampleState());
    }

    cloneTo(state: MultisampleState): MultisampleState {
        state.count = this.count;
        state.mask = this.mask;
        state.alphaToCoverageEnabled = this.alphaToCoverageEnabled;
        return state;
    }
}