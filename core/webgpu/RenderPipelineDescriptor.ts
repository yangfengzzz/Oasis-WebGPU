import {VertexState, FragmentState, PrimitiveState, DepthStencilState, MultisampleState} from "./state";

export class RenderPipelineDescriptor implements GPURenderPipelineDescriptor {
    private _label?: string = null;
    private _vertex: VertexState = new VertexState();
    private _fragment?: FragmentState = null;
    private _primitive?: PrimitiveState = null;
    private _depthStencil?: DepthStencilState = null;
    private _multisample?: MultisampleState = null;

    layout?: GPUPipelineLayout = null;

    get label(): string | null {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get vertex() {
        return this._vertex;
    }

    set vertex(value: VertexState) {
        if (value !== this._vertex) {
            value.cloneTo(this._vertex);
        }
    }

    get fragment(): FragmentState {
        if (this._fragment === null) {
            this._fragment = new FragmentState();
        }
        return this._fragment;
    }

    set fragment(value: FragmentState | null | undefined) {
        if (value === null || value === undefined) {
            this._fragment = null;
        } else {
            if (value !== this._fragment) {
                if (this._fragment) {
                    value.cloneTo(this._fragment);
                } else {
                    this._fragment = value.clone();
                }
            }
        }
    }

    get primitive(): PrimitiveState {
        if (this._primitive === null) {
            this._primitive = new PrimitiveState();
        }
        return this._primitive;
    }

    set primitive(value: PrimitiveState | null | undefined) {
        if (value === null || value === undefined) {
            this._primitive = null;
        } else {
            if (value !== this._primitive) {
                if (this._primitive) {
                    value.cloneTo(this._primitive);
                } else {
                    this._primitive = value.clone();
                }
            }
        }
    }

    get depthStencil(): DepthStencilState {
        if (this._depthStencil === null) {
            this._depthStencil = new DepthStencilState();
        }
        return this._depthStencil;
    }

    set depthStencil(value: DepthStencilState | null | undefined) {
        if (value === null || value === undefined) {
            this._depthStencil = null;
        } else {
            if (value !== this._depthStencil) {
                if (this._depthStencil) {
                    value.cloneTo(this._depthStencil);
                } else {
                    this._depthStencil = value.clone();
                }
            }
        }
    }

    get multisample(): MultisampleState {
        if (this._multisample === null) {
            this._multisample = new MultisampleState();
        }
        return this._multisample;
    }

    set multisample(value: MultisampleState | null | undefined) {
        if (value === null || value === undefined) {
            this._multisample = null;
        } else {
            if (value !== this._multisample) {
                if (this._multisample) {
                    value.cloneTo(this._multisample);
                } else {
                    this._multisample = value.clone();
                }
            }
        }
    }
}