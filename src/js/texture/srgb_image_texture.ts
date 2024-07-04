import { Texture } from './texture';
import { color, Color, Point3 } from '../math/vec3.gen';
import { clamp } from '../utils';
import { PixelsData } from './image-parsers/types';

export class SrgbImageTexture implements Texture {
    _pixels_data: PixelsData;
    constructor(pixels_data: PixelsData) {
        this._pixels_data = pixels_data;
    }

    value(u: number, v: number, p: Point3): Color {
        const {pixels, width, height, normalization} = this._pixels_data;
        const i = Math.floor(clamp(u, 0, 1) * width);
        const j = Math.floor(clamp(v, 0, 1) * height);

        const offset = (j * width + i) * 4;
        const r = pixels[offset] * normalization;
        const g = pixels[offset + 1] * normalization;
        const b = pixels[offset + 2] * normalization;

        return color(r ** 2.2, g ** 2.2, b ** 2.2);
    }
}