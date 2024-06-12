import { Ray } from "../math/ray";
import { point3, Point3, vec3, Vec3, vec3Dot } from '../math/vec3';
import { AABB } from './aabb';
import { createMegaMaterial, MegaMaterial } from '../materials/megamaterial';

export interface HitRecord {
    p: Point3;
    normal: Vec3;
    t: number;
    front_face: boolean;
    material: MegaMaterial;
    u: number;
    v: number;
}

const dummyMaterial: MegaMaterial = createMegaMaterial({
    fuzz: NaN,
    ior: NaN,
});

export const createEmptyHitRecord = (): HitRecord => {
    return {
        p: point3(0, 0, 0),
        normal: vec3(0, 0, 0),
        t: NaN,
        front_face: false,
        material: dummyMaterial,
        v: NaN,
        u: NaN
    };
};

export const hitRecord = (p: Point3, normal: Vec3, t: number, front_face: boolean, material: MegaMaterial, u: number, v: number): HitRecord => {
    return { p, normal, t, front_face, material, u, v };
};

export const set_face_normal = (hit: HitRecord, r: Ray, outward_normal: Vec3): void => {
    hit.front_face = vec3Dot(r.direction, outward_normal) < 0;
    const n = hit.normal;
    const l = Math.hypot(n[0], n[1], n[2]);
    if (hit.front_face) {
        hit.normal[0] = outward_normal[0] / l;
        hit.normal[1] = outward_normal[1] / l;
        hit.normal[2] = outward_normal[2] / l;
    } else {
        hit.normal[0] = -outward_normal[0] / l;
        hit.normal[1] = -outward_normal[1] / l;
        hit.normal[2] = -outward_normal[2] / l;
    }
};


export abstract class Hittable {
    abstract hit(r: Ray, t_min: number, t_max: number, hit: HitRecord): boolean;
    abstract get_bounding_box(time0: number, time1: number, aabb: AABB): void;

    pdf_value(origin: Vec3, direction: Vec3): number {
        return 0;
    }

    random(origin: Vec3): Vec3 {
        return vec3(1, 0, 0);
    }
}
