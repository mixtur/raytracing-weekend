import { RenderParameters, RenderWorkerMessage } from './types';
import { ColorWriter } from './color-writers';
import { RenderWorkerMessageData } from './render_worker';
import { color } from './math/vec3';
import { format_time } from './utils';

export async function multiThreadedRender(thread_number: number, render_parameters: RenderParameters, writer: ColorWriter): Promise<void> {
    const {
        image_width,
        image_height,
        samples_per_pixel,
        aspect_ratio,
        max_depth,
        scene_creation_random_numbers,
        line_order
    } = render_parameters;
    //todo: make it so that every thread handles first few lines quickly, and then slows down.
    //      In that case we'll get some image quickly and then its refinement will still be apparent

    const { writeColor, dumpLine, dumpImage } = writer;
    const outputBuffer = new Float64Array(image_width * image_height * 3);
    const outputLineCompleteness = new Uint8Array(image_height);
    const promises = [];
    let samples_sent = 0;
    const total_rays = image_width * image_height * samples_per_pixel;
    let done_rays = 0;
    const t0 = performance.now();
    for (let i = 0; i < thread_number; i++) {
        const worker = new Worker(new URL('./render_worker.js', import.meta.url), {type: 'module'});
        let eventCount = 0;
        const samples_to_send = Math.floor((i + 1) * samples_per_pixel / thread_number) - samples_sent;
        samples_sent += samples_to_send;
        // note: tried to use transferables explicitly, but it seems Chrome doesn't care. It even makes things slightly slower.
        worker.postMessage({
            aspect_ratio,
            image_width,
            image_height,
            samples_per_pixel: samples_to_send,
            max_depth,
            scene_creation_random_numbers,
            first_line_index: Math.floor(i / thread_number * image_height),
            line_order
        } as RenderWorkerMessage);

        const tmpColor = color(0, 0, 0);
        promises.push(new Promise<void>(resolve => {
            worker.onmessage = (ev: MessageEvent): void => {
                eventCount++;
                const {y, pixels} = ev.data as RenderWorkerMessageData;
                const completeness = ++outputLineCompleteness[y];
                const y_offset = y * image_width * 3;
                for (let line_component_index = 0; line_component_index < image_width * 3; line_component_index++) {
                    outputBuffer[y_offset + line_component_index] += pixels[line_component_index];
                }

                for (let x = 0; x < image_width; x++) {
                    tmpColor[0] = outputBuffer[y_offset + x * 3];
                    tmpColor[1] = outputBuffer[y_offset + x * 3 + 1];
                    tmpColor[2] = outputBuffer[y_offset + x * 3 + 2];
                    writeColor(x, y, tmpColor, samples_per_pixel * completeness / thread_number);
                }
                dumpLine(y);

                done_rays += image_width * samples_to_send;
                const dt = performance.now() - t0;
                const speed = done_rays / dt;
                const estimated_total_time = total_rays / speed;

                console.log(`[${format_time(dt)} / ${format_time(estimated_total_time)}]: casted ${(done_rays / total_rays * 100).toFixed(2).padStart(5)}% of all rays`);

                if (eventCount === image_height) {
                    console.log(`Thread #${i} - done`);
                    resolve();
                }
            };
        }))
    }

    for (const p of promises) {
        await p;
    }

    dumpImage();
}
