export enum Attributes {
    Position = 0,
    Normal,
    UV_0,
    Tangent,
    Bitangent,
    Color_0,
    Weights_0,
    Joints_0,
    UV_1,
    UV_2,
    UV_3,
    UV_4,
    UV_5,
    UV_6,
    UV_7,
    TOTAL_COUNT
}

export function attributesString(attr: Attributes): string {
    attr.toString();
    switch (attr) {
        case Attributes.Position:
            return "Position";
        case Attributes.Normal:
            return "Normal";
        case Attributes.UV_0:
            return "UV_0";
        case Attributes.Tangent:
            return "Tangent";
        case Attributes.Bitangent:
            return "Bitangent";
        case Attributes.Color_0:
            return "Color_0";
        case Attributes.Weights_0:
            return "Weights_0";
        case Attributes.Joints_0:
            return "Joints_0";
        case Attributes.UV_1:
            return "UV_1";
        case Attributes.UV_2:
            return "UV_2";
        case Attributes.UV_3:
            return "UV_3";
        case Attributes.UV_4:
            return "UV_4";
        case Attributes.UV_5:
            return "UV_5";
        case Attributes.UV_6:
            return "UV_6";
        case Attributes.UV_7:
            return "UV_7";
        default:
            throw "Unknown attribute";
    }
}

export enum UniformType {
    F32,
    I32,
    U32,

    Vec2f32,
    Vec2i32,
    Vec2u32,

    Vec3f32,
    Vec3i32,
    Vec3u32,

    Vec4f32,
    Vec4i32,
    Vec4u32,

    Mat2x2f32,
    Mat3x2f32,
    Mat4x2f32,
    Mat2x3f32,
    Mat3x3f32,
    Mat4x3f32,
    Mat2x4f32,
    Mat3x4f32,
    Mat4x4f32,
}

export function uniformTypeString(type: UniformType): string {
    switch (type) {
        case UniformType.F32:
            return "f32";

        case UniformType.I32:
            return "i32";

        case UniformType.U32:
            return "u32";

        case UniformType.Vec2f32:
            return "vec2<f32>";

        case UniformType.Vec2i32:
            return "vec2<i32>";

        case UniformType.Vec2u32:
            return "vec2<u32>";

        case UniformType.Vec3f32:
            return "vec3<f32>";

        case UniformType.Vec3i32:
            return "vec3<i32>";

        case UniformType.Vec3u32:
            return "vec3<u32>";

        case UniformType.Vec4f32:
            return "vec4<f32>";

        case UniformType.Vec4i32:
            return "vec4<i32>";

        case UniformType.Vec4u32:
            return "vec4<u32>";

        case UniformType.Mat2x2f32:
            return "mat2x2<f32>";

        case UniformType.Mat3x2f32:
            return "mat3x2<f32>";

        case UniformType.Mat4x2f32:
            return "mat4x2<f32>";

        case UniformType.Mat2x3f32:
            return "mat2x3<f32>";

        case UniformType.Mat3x3f32:
            return "mat3x3<f32>";

        case UniformType.Mat4x3f32:
            return "mat4x3<f32>";

        case UniformType.Mat2x4f32:
            return "mat2x4<f32>";

        case UniformType.Mat3x4f32:
            return "mat3x4<f32>";

        case UniformType.Mat4x4f32:
            return "mat4x4<f32>";

        default:
    }
}

//MARK: - TextureType
export enum TextureType {
    Texture1Df32,
    Texture1Di32,
    Texture1Du32,

    Texture2Df32,
    Texture2Di32,
    Texture2Du32,

    Texture2DArrayf32,
    Texture2DArrayi32,
    Texture2DArrayu32,

    Texture3Df32,
    Texture3Di32,
    Texture3Du32,

    TextureCubef32,
    TextureCubei32,
    TextureCubeu32,

    TextureCubeArrayf32,
    TextureCubeArrayi32,
    TextureCubeArrayu32,

    TextureMultisampled2Df32,
    TextureMultisampled2Di32,
    TextureMultisampled2Du32,

    TextureDepth2D,
    TextureDepth2DArray,
    TextureDepthCube,
    TextureDepthCubeArray,
    TextureDepthMultisampled2D,
}

export function textureTypeString(type: TextureType): string {
    switch (type) {
        case TextureType.Texture1Df32:
            return "texture_1d<f32>";

        case TextureType.Texture1Di32:
            return "texture_1d<i32>";

        case TextureType.Texture1Du32:
            return "texture_1d<u32>";


        case TextureType.Texture2Df32:
            return "texture_2d<f32>";

        case TextureType.Texture2Di32:
            return "texture_2d<i32>";

        case TextureType.Texture2Du32:
            return "texture_2d<u32>";


        case TextureType.Texture2DArrayf32:
            return "texture_2d_array<f32>";

        case TextureType.Texture2DArrayi32:
            return "texture_2d_array<i32>";

        case TextureType.Texture2DArrayu32:
            return "texture_2d_array<u32>";


        case TextureType.Texture3Df32:
            return "texture_3d<f32>";

        case TextureType.Texture3Di32:
            return "texture_3d<i32>";

        case TextureType.Texture3Du32:
            return "texture_3d<u32>";


        case TextureType.TextureCubef32:
            return "texture_cube<f32>";

        case TextureType.TextureCubei32:
            return "texture_cube<i32>";

        case TextureType.TextureCubeu32:
            return "texture_cube<u32>";


        case TextureType.TextureCubeArrayf32:
            return "texture_cube_array<f32>";

        case TextureType.TextureCubeArrayi32:
            return "texture_cube_array<i32>";

        case TextureType.TextureCubeArrayu32:
            return "texture_cube_array<u32>";


        case TextureType.TextureMultisampled2Df32:
            return "texture_multisampled_2d<f32>";

        case TextureType.TextureMultisampled2Di32:
            return "texture_multisampled_2d<i32>";

        case TextureType.TextureMultisampled2Du32:
            return "texture_multisampled_2d<u32>";


        case TextureType.TextureDepth2D:
            return "texture_depth_2d";

        case TextureType.TextureDepth2DArray:
            return "texture_depth_2d_array";

        case TextureType.TextureDepthCube:
            return "texture_depth_cube";

        case TextureType.TextureDepthCubeArray:
            return "texture_depth_cube_array";

        case TextureType.TextureDepthMultisampled2D:
            return "texture_depth_multisampled_2d";

        default:
    }
}

export function isMultisampled(type: TextureType): boolean {
    return type == TextureType.TextureMultisampled2Df32 ||
        type == TextureType.TextureMultisampled2Di32 ||
        type == TextureType.TextureMultisampled2Du32;

}

export function textureViewDimension(type: TextureType): GPUTextureViewDimension {
    switch (type) {
        case TextureType.Texture1Df32:
        case TextureType.Texture1Di32:
        case TextureType.Texture1Du32:
            return '1d';

        case TextureType.Texture2Df32:
        case TextureType.Texture2Di32:
        case TextureType.Texture2Du32:
        case TextureType.TextureMultisampled2Df32:
        case TextureType.TextureMultisampled2Di32:
        case TextureType.TextureMultisampled2Du32:
        case TextureType.TextureDepth2D:
        case TextureType.TextureDepthMultisampled2D:
            return '2d';

        case TextureType.Texture2DArrayf32:
        case TextureType.Texture2DArrayi32:
        case TextureType.Texture2DArrayu32:
        case TextureType.TextureDepth2DArray:
            return '2d-array';

        case TextureType.Texture3Df32:
        case TextureType.Texture3Di32:
        case TextureType.Texture3Du32:
            return '3d';

        case TextureType.TextureCubef32:
        case TextureType.TextureCubei32:
        case TextureType.TextureCubeu32:
        case TextureType.TextureDepthCube:
            return 'cube';

        case TextureType.TextureCubeArrayf32:
        case TextureType.TextureCubeArrayi32:
        case TextureType.TextureCubeArrayu32:
        case TextureType.TextureDepthCubeArray:
            return "cube-array";

        default:
            break;
    }
}

export function sampleType(type: TextureType): GPUTextureSampleType {
    switch (type) {
        case TextureType.Texture1Df32:
        case TextureType.Texture2Df32:
        case TextureType.Texture2DArrayf32:
        case TextureType.Texture3Df32:
        case TextureType.TextureCubef32:
        case TextureType.TextureCubeArrayf32:
        case TextureType.TextureMultisampled2Df32:
            return 'float';

        case TextureType.Texture1Di32:
        case TextureType.Texture2Di32:
        case TextureType.Texture2DArrayi32:
        case TextureType.Texture3Di32:
        case TextureType.TextureCubei32:
        case TextureType.TextureCubeArrayi32:
        case TextureType.TextureMultisampled2Di32:
            return 'sint';

        case TextureType.Texture1Du32:
        case TextureType.Texture2Du32:
        case TextureType.Texture2DArrayu32:
        case TextureType.Texture3Du32:
        case TextureType.TextureCubeu32:
        case TextureType.TextureCubeArrayu32:
        case TextureType.TextureMultisampled2Du32:
            return 'uint';

        case TextureType.TextureDepth2D:
        case TextureType.TextureDepth2DArray:
        case TextureType.TextureDepthCube:
        case TextureType.TextureDepthCubeArray:
        case TextureType.TextureDepthMultisampled2D:
            return 'depth'

        default:
            break;
    }
}

export enum SamplerType {
    Sampler,
    SamplerComparison
}

export function samplerTypeString(type: SamplerType): string {
    switch (type) {
        case SamplerType.Sampler:
            return "sampler";

        case SamplerType.SamplerComparison:
            return "sampler_comparison";

        default:
            break;
    }
}

export function bindingType(type: SamplerType): GPUSamplerBindingType {
    switch (type) {
        case SamplerType.Sampler:
            return 'filtering'

        case SamplerType.SamplerComparison:
            return 'comparison';

        default:
            break;
    }
}

export enum StorageTextureType {
    TextureStorage1D,
    TextureStorage2D,
    TextureStorage2DArray,
    TextureStorage3D
}

export function storageTextureTypeString(type: StorageTextureType): string {
    switch (type) {
        case StorageTextureType.TextureStorage1D:
            return "texture_storage_1d";
        case StorageTextureType.TextureStorage2D:
            return "texture_storage_2d";
        case StorageTextureType.TextureStorage2DArray:
            return "texture_storage_2d_array";
        case StorageTextureType.TextureStorage3D:
            return "texture_storage_3d";

        default:
            break;
    }
}

export function storageTextureViewDimension(type: StorageTextureType): GPUTextureViewDimension {
    switch (type) {
        case StorageTextureType.TextureStorage1D:
            return '1d';
        case StorageTextureType.TextureStorage2D:
            return '2d';
        case StorageTextureType.TextureStorage2DArray:
            return '2d-array';
        case StorageTextureType.TextureStorage3D:
            return '3d';

        default:
            break;
    }
}


export enum BuiltInType {
    VertexIndex,
    InstanceIndex,
    Position,
    FrontFacing,
    FragDepth,
    LocalInvocationID,
    LocalInvocationIndex,
    GlobalInvocationID,
    WorkgroupID,
    NumWorkgroups,
    SampleIndex,
    SampleMask,
}

export function builtInTypeString(type: BuiltInType): string {
    switch (type) {
        case BuiltInType.VertexIndex:
            return "vertex_index";
        case BuiltInType.InstanceIndex:
            return "instance_index";
        case BuiltInType.Position:
            return "position";
        case BuiltInType.FrontFacing:
            return "front_facing";
        case BuiltInType.FragDepth:
            return "frag_depth";
        case BuiltInType.LocalInvocationID:
            return "local_invocation_id";
        case BuiltInType.LocalInvocationIndex:
            return "local_invocation_index";
        case BuiltInType.GlobalInvocationID:
            return "global_invocation_id";
        case BuiltInType.WorkgroupID:
            return "workgroup_id";
        case BuiltInType.NumWorkgroups:
            return "num_workgroups";
        case BuiltInType.SampleIndex:
            return "sample_index";
        case BuiltInType.SampleMask:
            return "sample_mask";
        default:
            break;
    }
}


