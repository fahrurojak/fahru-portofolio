import fs from 'node:fs';

// The portfolio replaces both card faces at runtime. Remove only the unused
// baked bitmap; preserve every geometry/accessor byte and keep the source GLB.
const source = fs.readFileSync(new URL('../src/assets/lanyard/card.glb', import.meta.url));
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.subarray(20, 20 + jsonLength).toString());
const imageView = gltf.images?.[0]?.bufferView;
if (gltf.images?.length !== 1 || imageView !== gltf.bufferViews.length - 1) {
  throw new Error('Unexpected GLB structure; refusing to truncate geometry.');
}
const image = gltf.bufferViews[imageView];
if (image.byteOffset + image.byteLength !== gltf.buffers[0].byteLength) {
  throw new Error('Embedded texture must be the final buffer range.');
}
const binary = source.subarray(28 + jsonLength, 28 + jsonLength + image.byteOffset);
gltf.bufferViews.pop();
gltf.buffers[0].byteLength = binary.length;
delete gltf.images;
delete gltf.textures;
delete gltf.samplers;
for (const material of gltf.materials) {
  if (material.pbrMetallicRoughness) delete material.pbrMetallicRoughness.baseColorTexture;
}
const json = Buffer.from(JSON.stringify(gltf));
const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(padded);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + padded.length + binary.length, 8);
header.writeUInt32LE(padded.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binary.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4);
const result = Buffer.concat([header, padded, binHeader, binary]);
fs.writeFileSync(new URL('../src/assets/lanyard/card-optimized.glb', import.meta.url), result);
console.log(`GLB: ${source.length} -> ${result.length} bytes; geometry preserved.`);
