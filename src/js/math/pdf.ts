// Probability Distribution Function
import {
    Point3,
    vec3,
    Vec3,
    vec3Dot,
    vec3RandCosineUnit,
    vec3RandomInHemisphere,
    vec3RandUnit,
    vec3RandUnitOnHemisphere,
    vec3Unit1
} from './vec3';
import { Mat3, mat3FromZ1, mulMat3Vec3_2 } from './mat3';
import { Hittable } from '../hittable/hittable';

export interface PDF {
    value(direction: Vec3): number;
    generate(): Vec3;
}

export class SpherePDF implements PDF {
    value(direction: Vec3): number {
        return 1 / (4 * Math.PI);
    }

    generate(): Vec3 {
        return vec3RandUnit();
    }
}

export class HemispherePDF implements PDF {
    transform: Mat3;
    constructor(lobe_direction: Vec3) {
        this.transform = mat3FromZ1(lobe_direction);
    }

    value(_direction: Vec3): number {
        return 1 / (2 * Math.PI);
    }

    generate(): Vec3 {
        return mulMat3Vec3_2(this.transform, vec3RandUnitOnHemisphere());
    }
}

export class CosinePDF implements PDF {
    transform: Mat3;
    lobe_direction: Vec3;
    constructor(lobe_direction: Vec3) {
        this.transform = mat3FromZ1(lobe_direction);
        this.lobe_direction = vec3Unit1(lobe_direction);
    }
    value(direction: Vec3): number {
        const cosT = vec3Dot(vec3Unit1(direction), this.lobe_direction);
        return Math.max(0, cosT / Math.PI);
    }
    generate(): Vec3 {
        return mulMat3Vec3_2(this.transform, vec3RandCosineUnit());
    }
}

export class HittablePDF implements PDF {
    hittable: Hittable;
    origin: Vec3;
    constructor(hittable: Hittable, origin: Point3) {
        this.hittable = hittable;
        this.origin = origin;
    }

    value(direction: Vec3): number {
        return this.hittable.pdf_value(this.origin, direction);
    }

    generate(): Vec3 {
        return this.hittable.random(this.origin);
    }
}

export class MixturePDF implements PDF {
    pdf1: PDF;
    pdf2: PDF;
    constructor(pdf1: PDF, pdf2: PDF) {
        this.pdf1 = pdf1;
        this.pdf2 = pdf2;
    }

    value(direction: Vec3): number {
        return (this.pdf1.value(direction) + this.pdf2.value(direction)) / 2;
    }

    generate(): Vec3 {
        return Math.random() < 0.5
            ? this.pdf1.generate()
            : this.pdf2.generate();
    }
}