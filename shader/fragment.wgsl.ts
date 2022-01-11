export default 
`[[stage(fragment)]]
fn main([[location(0)]] vColor: vec3<f32>) ->  [[location(0)]] vec4<f32> {
  return vec4<f32>(vColor, 1.0);
}`;