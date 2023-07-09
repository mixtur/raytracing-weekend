import {
    color,
    vec3Add3,
    vec3AllocatorScopeSync
} from './vec3';
import { ArenaVec3Allocator } from './vec3_allocators';
// import { simple_light } from './scenes/simple_light';
// import { create_earth_scene } from './scenes/earth';
// import { lots_of_spheres } from './scenes/lots_of_spheres';
// import { two_spheres } from './scenes/two_spheres';
// import { two_perlin_spheres } from './scenes/two_perlin_spheres';
// import { cornell_box } from './scenes/cornell_box';
import { ColorWriter, createArrayWriter, createCanvasColorWriter } from './color-writers';
// import { cornell_box_with_smoke } from './scenes/cornell_box_with_smoke';
// import { ray_color } from './ray_color';
// import { RenderWorkerMessageData } from './render_worker';
// import { RenderParameters } from './types';
import { multiThreadedRender } from './multi_threaded_render';
// import { singleThreadedRender } from './single_threaded_render';

const aspect_ratio = 1;
const image_width = 800;
const image_height = Math.round(image_width / aspect_ratio);
const samples_per_pixel = 100;
const max_depth = 50;

const writer = createCanvasColorWriter(image_width, image_height);
// const writer = createArrayWriter(image_width, image_height, (array) => {
//     console.log(array);
// });

const scene_creation_random_numbers = [];
for (let i = 0; i < 2048; i++) {
    scene_creation_random_numbers.push(Math.random());
}

multiThreadedRender(4, {
    aspect_ratio,
    image_width,
    image_height,
    samples_per_pixel,
    max_depth,
    scene_creation_random_numbers
}, writer).catch((e) => {
    console.log(e);
});


// singleThreadedRender({
//     aspect_ratio,
//     image_width,
//     image_height,
//     samples_per_pixel,
//     max_depth,
//     scene_creation_random_numbers
// }, writer).catch((e) => {
//     console.log(e);
// });
