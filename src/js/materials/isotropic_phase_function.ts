import { BounceRecord, Material } from './material';
import { Texture } from '../texture/texture';
import { ray, Ray } from '../ray';
import { HitRecord } from '../hittable/hittable';
import { color, Color, Point3, vec3RandInUnitSphere } from '../vec3';

export class IsotropicPhaseFunction extends Material {
    albedo: Texture;

    constructor(albedo: Texture) {
        super();
        this.albedo = albedo;
    }

    scatter(r_in: Ray, hit: HitRecord): BounceRecord | null {
        return {
            scattered: ray(hit.p, vec3RandInUnitSphere(), r_in.time),
            attenuation: this.albedo.value(hit.u, hit.v, hit.p)
        };
    }
}
