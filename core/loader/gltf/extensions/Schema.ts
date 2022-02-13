import {IMaterialNormalTextureInfo, ITextureInfo} from "../Schema";

/**
 * Interfaces from the KHR_lights_punctual extension
 */
export interface IKHRLightsPunctual_LightNode {
    light: number;
}

export interface IKHRLightsPunctual_Light {
    type: "directional" | "point" | "spot";
    color?: number[];
    intensity?: number;
    range?: number;
    spot?: {
        innerConeAngle?: number;
        outerConeAngle?: number;
    };
}

export interface IKHRLightsPunctual {
    lights: IKHRLightsPunctual_Light[];
}

/**
 * Interfaces from the KHR_draco_mesh_compression extension
 */
export interface IKHRDracoMeshCompression {
    bufferView: number;
    attributes: {
        [name: string]: number;
    };
}

/**
 * Interfaces from the KHR_materials_clearcoat extension
 */
export interface IKHRMaterialsClearcoat {
    clearcoatFactor: number;
    clearcoatTexture: ITextureInfo;
    clearcoatRoughnessFactor: number;
    clearcoatRoughnessTexture: ITextureInfo;
    clearcoatNormalTexture: IMaterialNormalTextureInfo;
}

/**
 * Interfaces from the KHR_materials_ior extension
 */
export interface IKHRMaterialsIor {
    ior: number;
}

/**
 * Interfaces from the KHR_materials_unlit extension
 */
export interface IKHRMaterialsUnlit {
}

/**
 * Interfaces from the KHR_materials_pbrSpecularGlossiness extension
 */
export interface IKHRMaterialsPbrSpecularGlossiness {
    diffuseFactor: number[];
    diffuseTexture: ITextureInfo;
    specularFactor: number[];
    glossinessFactor: number;
    specularGlossinessTexture: ITextureInfo;
}

/**
 * Interfaces from the KHR_materials_sheen extension
 */
export interface IKHRMaterialsSheen {
    sheenColorFactor?: number[];
    sheenColorTexture?: ITextureInfo;
    sheenRoughnessFactor?: number;
    sheenRoughnessTexture?: ITextureInfo;
}

/**
 * Interfaces from the KHR_materials_specular extension
 */
export interface IKHRMaterialsSpecular {
    specularFactor: number;
    specularColorFactor: number[];
    specularTexture: ITextureInfo;
}

/**
 * Interfaces from the KHR_materials_transmission extension
 */
export interface IKHRMaterialsTransmission {
    transmissionFactor?: number;
    transmissionTexture?: ITextureInfo;
}

/**
 * Interfaces from the KHR_materials_translucency extension
 */
export interface IKHRMaterialsTranslucency {
    translucencyFactor?: number;
    translucencyTexture?: ITextureInfo;
}

/**
 * Interfaces from the KHR_materials_variants extension
 */
export interface IKHRMaterialVariants_Mapping {
    mappings: Array<{
        variants: number[];
        material: number;
    }>;
    extensions?: any;
    extras?: any;
}

export interface IKHRMaterialVariants_Variant {
    name: string;
    extensions?: any;
    extras?: any;
}

export interface IKHRMaterialVariants_Variants {
    variants: Array<IKHRMaterialVariants_Variant>;
}

/**
 * Interfaces from the KHR_texture_basisu extension
 */
export interface IKHRTextureBasisU {
    source: number;
}

/**
 * Interfaces from the KHR_texture_transform extension
 */
export interface IKHRTextureTransform {
    offset?: number[];
    rotation?: number;
    scale?: number[];
    texCoord?: number;
}

/**
 * Interfaces from the KHR_xmp extension
 */
export interface IKHRXmp {
    packets: Array<{
        [key: string]: unknown;
    }>;
}

export interface IKHRXmp_Node {
    packet: number;
}

export type ExtensionSchema =
    | IKHRLightsPunctual_Light
    | IKHRDracoMeshCompression
    | IKHRMaterialsClearcoat
    | IKHRMaterialsIor
    | IKHRMaterialsUnlit
    | IKHRMaterialsPbrSpecularGlossiness
    | IKHRMaterialsSheen
    | IKHRMaterialsSpecular
    | IKHRMaterialsTransmission
    | IKHRMaterialsTranslucency
    | IKHRMaterialVariants_Mapping
    | IKHRMaterialVariants_Variants
    | IKHRTextureBasisU
    | IKHRTextureTransform
    | IKHRXmp
    | IKHRXmp_Node;
