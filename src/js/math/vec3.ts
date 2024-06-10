import { random, randomMinMax } from './random';
import { ArenaVec3Allocator, GCVec3Allocator, Vec3Allocator } from './vec3_allocators';

export type Vec3 = Float64Array;
export type Color = Vec3;
export type Point3 = Vec3;

export const gcAllocator = new GCVec3Allocator();
export const defaultAllocator = new ArenaVec3Allocator(64);

let allocator: Vec3Allocator = defaultAllocator;
export const vec3SetAllocator = (a: Vec3Allocator): void => { allocator = a; };
export const vec3AllocatorScopeSync = <T>(a: Vec3Allocator, f: () => T): T => {
    const prevAllocator = allocator;
    allocator = a;
    const result = f();
    allocator = prevAllocator;
    return result;
};

export const vec3AllocatorScopeAsync = async <T>(a: Vec3Allocator, f: () => Promise<T>): Promise<T> => {
    const prevAllocator = allocator;
    allocator = a;
    const result = await f();
    allocator = prevAllocator;
    return result;
};


export const vec3 = (x: number, y: number, z: number): Vec3 => allocator.alloc(x, y, z);
export const color = vec3;
export const point3 = vec3;

export const vec3Set = (v: Vec3, x: number, y: number, z: number): void => {
    v[0] = x;
    v[1] = y;
    v[2] = z;
}

export const vec3Sub2 = (a: Vec3, b: Vec3): Vec3 => vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const vec3Sub3 = (result: Vec3, a: Vec3, b: Vec3): void => {
    result[0] = a[0] - b[0];
    result[1] = a[1] - b[1];
    result[2] = a[2] - b[2];
};

export const vec3Add2 = (a: Vec3, b: Vec3): Vec3 => vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
export const vec3Add3 = (result: Vec3, a: Vec3, b: Vec3): void => {
    result[0] = a[0] + b[0];
    result[1] = a[1] + b[1];
    result[2] = a[2] + b[2];
};

export const vec3MulS2 = (a: Vec3, s: number): Vec3 => vec3(a[0] * s, a[1] * s, a[2] * s);
export const vec3MulS3 = (a: Vec3, b: Vec3, s: number): void => {
    a[0] = b[0] * s;
    a[1] = b[1] * s;
    a[2] = b[2] * s;
};

export const vec3DivS2 = (a: Vec3, s: number): Vec3 => vec3(a[0] / s, a[1] / s, a[2] / s);
export const vec3DivS3 = (a: Vec3, b: Vec3, s: number): void => {
    a[0] = b[0] / s;
    a[1] = b[1] / s;
    a[2] = b[2] / s;
};

export const vec3Len = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export const vec3SqLen = (a: Vec3): number => a[0] ** 2 + a[1] ** 2 + a[2] ** 2;

export const vec3MulV2 = (a: Vec3, b: Vec3): Vec3 => vec3(a[0] * b[0], a[1] * b[1], a[2] * b[2]);
export const vec3MulV3 = (a: Vec3, b: Vec3, c: Vec3): void => {
    a[0] = b[0] * c[0];
    a[1] = b[1] * c[1];
    a[2] = b[2] * c[2];
};

// a * b + c
export const vec3MulVAddV3 = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
    return vec3(
        a[0] * b[0] + c[0],
        a[1] * b[1] + c[1],
        a[2] * b[2] + c[2]
    );
}

export const vec3MulVAddV4 = (result: Vec3, a: Vec3, b: Vec3, c: Vec3): void => {
    result[0] = a[0] * b[0] + c[0];
    result[1] = a[1] * b[1] + c[1];
    result[2] = a[2] * b[2] + c[2];
}

export const vec3MulSAddV3 = (a: Vec3, b: number, c: Vec3): Vec3 => {
    return vec3(
        a[0] * b + c[0],
        a[1] * b + c[1],
        a[2] * b + c[2]
    );
};

export const vec3MulSAddV4 = (result: Vec3, a: Vec3, b: number, c: Vec3): void => {
    result[0] = a[0] * b + c[0];
    result[1] = a[1] * b + c[1];
    result[2] = a[2] * b + c[2];
}

export const vec3Dot = (a: Vec3, b: Vec3): number => {
    return a[0] * b[0]
         + a[1] * b[1]
         + a[2] * b[2];
}

export const vec3Cross2 = (a: Vec3, b: Vec3): Vec3 => {
    return vec3(
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    );
};

export const vec3Cross3 = (a: Vec3, b: Vec3, c: Vec3): void => {
    const x = b[1] * c[2] - b[2] * c[1];
    const y = b[2] * c[0] - b[0] * c[2];
    a[2] = b[0] * c[1] - b[1] * c[0];
    a[0] = x;
    a[1] = y;
};

export const vec3Unit1 = (a: Vec3): Vec3 => vec3MulS2(a, 1 / vec3Len(a));

export const vec3Unit2 = (result: Vec3, a: Vec3): void => vec3DivS3(result, a, vec3Len(a));

export const vec3Mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => {
    const q = 1 - t;
    return vec3(
        q * a[0] + t * b[0],
        q * a[1] + t * b[1],
        q * a[2] + t * b[2],
    );
};

export const vec3Mix4 = (result: Vec3, a: Vec3, b: Vec3, t: number): void => {
    const q = 1 - t;
    result[0] = q * a[0] + t * b[0];
    result[1] = q * a[1] + t * b[1];
    result[2] = q * a[2] + t * b[2];
};

export const vec3Negate1 = (a: Vec3): Vec3 => {
    return vec3(-a[0], -a[1], -a[2]);
};

export const vec3Negate2 = (result: Vec3, a: Vec3): void => {
    result[0] = -a[0];
    result[1] = -a[1];
    result[2] = -a[2];
};

export const vec3Rand = (): Vec3 => vec3(random(), random(), random());
export const vec3Rand1 = (v: Vec3): void => {
    v[0] = random();
    v[1] = random();
    v[2] = random();
}

export const vec3RandMinMax2 = (min: number, max: number): Vec3 => vec3(randomMinMax(min, max), randomMinMax(min, max), randomMinMax(min, max));
export const vec3RandMinMax3 = (v: Vec3, min: number, max: number): void => {
    v[0] = randomMinMax(min, max);
    v[1] = randomMinMax(min, max);
    v[2] = randomMinMax(min, max);
};

export const vec3RandInUnitSphere = (): Vec3 => {
    const v = vec3RandMinMax2(-1, 1);
    while (vec3SqLen(v) >= 1) {
        vec3RandMinMax3(v, -1, 1);
    }
    return v;
};

export const vec3RandInUnitSphere1 = (v: Vec3): void => {
    vec3RandMinMax3(v, -1, 1);
    while (vec3SqLen(v) >= 1) {
        vec3RandMinMax3(v, -1, 1);
    }
};

export const vec3RandUnit = (): Vec3 => {
    const r1 = Math.random();
    const r2 = Math.random() * Math.PI * 2;
    const cosT = 1 - 2 * r1;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const sinP = Math.sin(r2);
    const cosP = Math.cos(r2);

    return vec3(
        sinT * cosP,
        sinT * sinP,
        cosT
    );
};

export const vec3RandUnit1 = (v: Vec3): void => {
    const r1 = Math.random();
    const r2 = Math.random() * Math.PI * 2;
    const cosT = 1 - 2 * r1;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const sinP = Math.sin(r2);
    const cosP = Math.cos(r2);

    v[0] = sinT * cosP;
    v[1] = sinT * sinP;
    v[2] = cosT;
};

export const vec3RandCosineUnit = (): Vec3 => {
    const r1 = Math.random() * Math.PI * 2;
    const r2 = Math.random();

    const cosP = Math.cos(r1);
    const sinP = Math.sin(r1);
    const cosT = Math.sqrt(1 - r2);
    const sinT = Math.sqrt(r2);

    return vec3(
        cosP * sinT,
        sinP * sinT,
        cosT
    );
}

export const vec3RandCosineUnit1 = (v: Vec3): void => {
    const r1 = Math.random() * Math.PI * 2;
    const r2 = Math.random();

    const cosP = Math.cos(r1);
    const sinP = Math.sin(r1);
    const cosT = Math.sqrt(1 - r2);
    const sinT = Math.sqrt(r2);

    v[0] = cosP * sinT;
    v[1] = sinP * sinT;
    v[2] = cosT;
}

export const vec3RandomInHemisphere = (normal: Vec3) : Vec3 => {
    const in_unit_sphere = vec3RandInUnitSphere();
    return vec3Dot(in_unit_sphere, normal) < 0
        ? vec3Negate1(in_unit_sphere)
        : in_unit_sphere;
};

export const vec3NearZero = (v: Vec3): boolean => {
    const eps = 1e-8;
    return Math.abs(v[0]) < eps && Math.abs(v[1]) < eps && Math.abs(v[2]) < eps;
};

export const vec3Reflect = (v: Vec3, normal: Vec3): Vec3 => {
    const result = vec3MulS2(normal, 2 * vec3Dot(v, normal));
    vec3Sub3(result, v, result);
    return result;
};

export const vec3Refract = (v: Vec3, normal: Vec3, ior: number): Vec3 => {
    const cos_theta = -vec3Dot(normal, v);
    const v_proj = vec3MulS2(normal, cos_theta);
    const out_x_dir = v_proj;
    vec3Add3(out_x_dir, v, v_proj);
    const out_x = out_x_dir;
    vec3MulS3(out_x, out_x_dir, ior);
    const out_y = vec3MulS2(normal, -Math.sqrt(1 - vec3SqLen(out_x)));
    vec3Add3(out_x, out_x, out_y);
    return out_x;
};


export const vec3RandInUnitDisk = (): Vec3 => {
    while (true) {
        const p = vec3(randomMinMax(-1, 1), randomMinMax(-1, 1), 0);
        if (vec3SqLen(p) >= 1) continue;
        return p;
    }
}