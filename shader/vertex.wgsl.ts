export default
`[[block]]struct uPMatrixUniforms {
  [[size(64)]]m: mat4x4<f32>;
};

[[block]]struct uMVMatrixUniforms {
  [[size(64)]]m: mat4x4<f32>;
};

[[group(0), binding(0)]]
var<uniform> uPMatrix: uPMatrixUniforms;
[[group(0), binding(1)]]
var<uniform> uMVMatrix: uMVMatrixUniforms;

struct VertexInput {
    [[location(0)]] aVertexPosition: vec3<f32>;
    [[location(1)]] aVertexColor: vec3<f32>;
    [[location(4)]] aVertexUV: vec2<f32>;
};

struct Output {
  [[location(0)]] vColor: vec3<f32>;
  [[builtin(position)]] Position: vec4<f32>;
};

[[stage(vertex)]]
fn main(vertexInput: VertexInput) -> Output {
  var output: Output;
  output.Position = uPMatrix.m * uMVMatrix.m * vec4<f32>(vertexInput.aVertexPosition, 1.0);
  output.vColor = vertexInput.aVertexPosition;
  return output;
}`;