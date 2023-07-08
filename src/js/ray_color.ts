import { Ray } from './ray';
import { color, Color, point3, vec3, vec3Add2, vec3Add3, vec3MulV2, vec3MulV3, vec3MulVAddV4 } from './vec3';
import { createEmptyHitRecord, Hittable } from './hittable/hittable';

const hit = createEmptyHitRecord();
export const ray_color = (r: Ray, background: Color, world: Hittable, depth: number): Color => {
    if (depth <= 0) {
        return color(0, 0, 0);
    }
    {// world
        if (world.hit(r, 0.0001, Infinity, hit)) {
            const bounce = hit.material.scatter(hit.material, r, hit);
            let totalEmission = hit.material.emit.value(hit.u, hit.v, hit.p);
            if (bounce) {
                const bounceColor = ray_color(bounce.scattered, background, world, depth - 1);
                //vec3Add3 shouldn't work here because we may screw up the light source
                totalEmission = vec3Add2(totalEmission, vec3MulV2(bounceColor, bounce.attenuation));
            }
            return totalEmission;
        }
    }

    return background;
};

export const ray_color_iterative = (r: Ray, background: Color, world: Hittable, depth: number): Color => {
    const totalEmission = color(0, 0, 0);
    const totalAttenuation = color(1, 1, 1);
    // const hit = createEmptyHitRecord();
    for (let i = 0; i < depth; i++) {
        if (!world.hit(r, 0.0001, Infinity, hit)) {
            vec3MulVAddV4(totalEmission, totalAttenuation, background, totalEmission);
            break;
        }
        const bounce = hit.material.scatter(hit.material, r, hit);
        const emission = hit.material.emit.value(hit.u, hit.v, hit.p);
        vec3MulVAddV4(totalEmission, totalAttenuation, emission, totalEmission);
        if (bounce) {
            vec3MulV3(totalAttenuation, totalAttenuation, bounce.attenuation);
            r = bounce.scattered;
        } else {
            break;
        }
    }
    return totalEmission;
};
