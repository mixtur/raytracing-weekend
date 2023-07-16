import { Ray } from './ray';
import { color, Color, vec3Add2, vec3MulS2, vec3MulV2, vec3MulV3, vec3MulVAddV3, vec3MulVAddV4 } from './vec3';
import { createEmptyHitRecord, Hittable } from './hittable/hittable';
import { createBounceRecord } from './materials/megamaterial';

const hit = createEmptyHitRecord();
const bounce = createBounceRecord();
export const ray_color = (r: Ray, background: Color, world: Hittable, depth: number): Color => {
    if (depth <= 0) {
        return color(0, 0, 0);
    }
    {// world
        if (world.hit(r, 0.0001, Infinity, hit)) {
            let totalEmission = hit.material.emit.value(hit.u, hit.v, hit.p);
            if (hit.material.scatter(hit.material, r, hit, bounce)) {
                const bounceColor = ray_color(bounce.scattered, background, world, depth - 1);
                const pdfFactor = hit.material.scattering_pdf(r, hit, bounce.scattered) / bounce.sampling_pdf;
                // vec3MulVAddV3 may not work because we can screw up the light source
                totalEmission = vec3MulVAddV3(bounceColor, vec3MulS2(bounce.attenuation, pdfFactor), totalEmission);
            }
            return totalEmission;
        }
    }

    return background;
};

export const ray_color_iterative = (r: Ray, background: Color, world: Hittable, depth: number): Color => {
    const totalEmission = color(0, 0, 0);
    const totalAttenuation = color(1, 1, 1);
    for (let i = 0; i < depth; i++) {
        if (!world.hit(r, 0.0001, Infinity, hit)) {
            vec3MulVAddV4(totalEmission, totalAttenuation, background, totalEmission);
            break;
        }
        const emission = hit.material.emit.value(hit.u, hit.v, hit.p);
        vec3MulVAddV4(totalEmission, totalAttenuation, emission, totalEmission);
        if (hit.material.scatter(hit.material, r, hit, bounce)) {
            const pdfFactor = hit.material.scattering_pdf(r, hit, bounce.scattered) /  bounce.sampling_pdf;

            vec3MulV3(totalAttenuation, totalAttenuation, vec3MulS2(bounce.attenuation, pdfFactor));
            r = bounce.scattered;
        } else {
            break;
        }
    }
    return totalEmission;
};
