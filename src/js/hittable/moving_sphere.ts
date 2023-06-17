import { Ray, rayAt2 } from "../ray";
import { Point3, vec3Dot, vec3Sub2, vec3DivS2, vec3Mix3 } from '../vec3';
import { HitRecord, Hittable, set_face_normal } from "./hittable";
import { Material } from '../material';

export class MovingSphere implements Hittable {
    center0: Point3;
    center1: Point3;
    time0: number;
    time1: number;
    dt: number;
    radius: number;
    material: Material;

    getCenter(time: number) {
        const p = (time - this.time0) / this.dt;
        return vec3Mix3(this.center0, this.center1, p);
    }

    constructor(center0: Point3, center1: Point3, time0: number, time1: number, radius: number, material: Material) {
        this.center0 = center0;
        this.center1 = center1;
        this.time0 = time0;
        this.time1 = time1;
        this.dt = time1 - time0;
        this.radius = radius;
        this.material = material;
    }
    hit(r: Ray, t_min: number, t_max: number): HitRecord | null {
        const {radius} = this;
        const center = this.getCenter(r.time);

        const oc = vec3Sub2(r.origin, center);
        const a = vec3Dot(r.direction, r.direction);
        const half_b = vec3Dot(oc, r.direction);
        const c = vec3Dot(oc, oc) - radius ** 2;
        const D = half_b * half_b - a * c;
        if (D < 0) return null;
        const sqrt_d = Math.sqrt(D);
        let t = ( -half_b - sqrt_d ) / a;
        if (t < t_min || t_max < t) {
            t = ( -half_b + sqrt_d ) / a;
            if (t < t_min || t_max < t) {
                return null;
            }
        }
        const p = rayAt2(r, t);

        const hit = {
            t,
            p,
            normal: vec3DivS2(vec3Sub2(p, center), radius),
            front_face: false,
            material: this.material
        };

        set_face_normal(hit, r, hit.normal);

        return hit;
    }
}