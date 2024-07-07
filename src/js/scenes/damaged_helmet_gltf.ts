import { load_gltf } from '../gltf_loader/loader';
import { create_scene, Scene } from './scene';
import { point3, vec3 } from '../math/vec3.gen';
import { Camera } from '../camera';
import { load_rgbe } from '../texture/image-parsers/rgbe_image_parser';
import { Skybox } from '../hittable/skybox';

export const load_damaged_helmet_gltf = async (): Promise<Scene> => {
    const scene = await load_gltf('gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', 1024000, 1024, 25);
    const env = await load_rgbe(2000, 'hdr/Cannon_Exterior.hdr');
    const skybox = Skybox.create_hdr(env);

    return create_scene({
        // light: skybox,
        camera: new Camera({
            look_from: point3(3, -1, 3),
            look_at: point3(0, 0, 0),
            v_up: vec3(0, 1, 0),
            focus_dist: 3.8,
            aperture: 0.05,
            y_fov: 30,
            time0: 0,
            time1: 1
        }),
        root_hittable: scene,
        background: skybox
    });
}
