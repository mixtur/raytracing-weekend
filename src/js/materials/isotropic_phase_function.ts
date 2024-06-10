import { Texture } from '../texture/texture';
import { raySet } from '../math/ray';
import { vec3RandInUnitSphere } from '../math/vec3';
import { createMegaMaterial, MegaMaterial, ScatterFunction } from './megamaterial';

export const createIsotropicPhaseFunction = (albedo: Texture): MegaMaterial => createMegaMaterial(isotropic_phase_function_scatter, null, { albedo });

export const isotropic_phase_function_scatter: ScatterFunction = (mat, r_in, hit, bounce) => {
    raySet(bounce.scattered, hit.p, vec3RandInUnitSphere(), r_in.time);
    bounce.attenuation.set(mat.albedo.value(hit.u, hit.v, hit.p));
    return true;
};
