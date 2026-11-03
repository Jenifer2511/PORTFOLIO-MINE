import * as THREE from "three";

import works from "./works.js";
export { works };

export async function createGallery({
  host,
  onSelect,
  reducedMotion,
  signal,
  onReady,
  initialIndex,
  initialProgress = 0,
}) {
  const step = Math.PI / 4;
  const fallback = document.querySelector("#gallery-fallback");
  const startIndex =
    initialIndex ?? Math.round(initialProgress * 3) % works.length;
  let target = startIndex * step - initialProgress * step * 3,
    current = startIndex * step,
    scrollOffset = initialProgress * step * 3,
    scrollProgress = initialProgress;
  let announced = false;
  let selected = startIndex,
    visible = false,
    dragging = false,
    moved = false,
    downX = 0,
    downY = 0,
    lastX = 0,
    lastTime = 0,
    dragVelocity = 0;
  let renderer,
    scene,
    camera,
    group,
    resizeObserver,
    intersectionObserver,
    disposed = false,
    needsRender = true;
  let fallbackMode = reducedMotion;
  const pointer = new THREE.Vector2();
  const targetPointer = new THREE.Vector2();
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const meshes = [],
    textures = [],
    cleanup = [];
  const emit = (index) => {
    selected = ((index % 4) + 4) % 4;
    onSelect(works[selected], selected);
  };
  const fallbackSelect = (delta) => {
    emit(selected + delta);
    fallback.children[selected].scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    cleanup.forEach((fn) => fn());
    meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    textures.forEach((texture) => texture.dispose());
    renderer?.dispose();
    renderer?.domElement.remove();
    onReady?.(false);
  };
  const staticApi = {
    select: fallbackSelect,
    setScroll() {},
    update() {},
    dispose,
  };
  if (reducedMotion) return staticApi;
  signal?.addEventListener("abort", dispose, { once: true });
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xeeeee7, 0);
    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add(group);
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.z = 8;
    const loader = new THREE.TextureLoader();
    textures.push(
      ...(await Promise.all(
        works.map(async (work) => {
          const texture = await loader.loadAsync(work.image);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            4,
            renderer.capabilities.getMaxAnisotropy(),
          );
          return texture;
        }),
      )),
    );
    if (signal?.aborted) {
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      return null;
    }
    for (let i = 0; i < 8; i++) {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: textures[i % 4] },
          uVelocity: { value: 0 },
          uShade: { value: 1 },
        },
        vertexShader: `varying vec2 vUv;
          uniform float uVelocity;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.z -= p.x * p.x / 14.0;
            p.z += sin(uv.x * 3.14159) * sin(uv.y * 3.14159) * clamp(uVelocity, -0.16, 0.16);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }`,
        fragmentShader: `uniform sampler2D uMap;
          uniform float uShade;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(uMap, vUv);
            gl_FragColor.rgb *= uShade;
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 5.2 / 1.5, 48, 12),
        material,
      );
      mesh.userData.index = i % 4;
      group.add(mesh);
      meshes.push(mesh);
    }
    host.appendChild(renderer.domElement);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      const worldWidth = width < 600 ? 6.4 : width < 1000 ? 8.4 : 10.4;
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(worldWidth / (16 * camera.aspect)),
      );
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      needsRender = true;
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        needsRender = true;
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(host);
    const listen = (type, handler) => {
      host.addEventListener(type, handler);
      cleanup.push(() => host.removeEventListener(type, handler));
    };
    listen("pointerdown", (event) => {
      if (event.button !== 0) return;
      downX = lastX = event.clientX;
      downY = event.clientY;
      lastTime = performance.now();
      moved = false;
      dragging = true;
      dragVelocity = 0;
      host.setPointerCapture(event.pointerId);
    });
    listen("pointermove", (event) => {
      if (finePointer && event.pointerType !== "touch") {
        const r = host.getBoundingClientRect();
        targetPointer.set(
          ((event.clientX - r.left) / r.width) * 2 - 1,
          ((event.clientY - r.top) / r.height) * 2 - 1,
        );
      }
      if (!dragging) return;
      if (Math.abs(event.clientX - downX) > 6) moved = true;
      if (
        Math.abs(event.clientY - downY) >
        Math.abs(event.clientX - downX) + 12
      ) {
        dragging = false;
        return;
      }
      const now = performance.now(),
        change = -(event.clientX - lastX) * 0.0045;
      dragVelocity = change / Math.max((now - lastTime) / 1000, 0.008);
      target += change;
      lastX = event.clientX;
      lastTime = now;
    });
    listen("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        const momentum = THREE.MathUtils.clamp(
          dragVelocity * 0.12,
          -step * 0.6,
          step * 0.6,
        );
        target =
          Math.round((target + scrollOffset + momentum) / step) * step -
          scrollOffset;
      }
    });
    listen("pointercancel", () => {
      dragging = false;
      targetPointer.set(0, 0);
    });
    listen("pointerleave", () => {
      targetPointer.set(0, 0);
    });
    const resetPointer = () => {
      targetPointer.set(0, 0);
      dragging = false;
    };
    window.addEventListener("blur", resetPointer);
    cleanup.push(() => window.removeEventListener("blur", resetPointer));
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        fallbackMode = true;
        onReady?.(false);
        visible = false;
      },
      { once: true },
    );
  } catch (error) {
    dispose();
    console.info("Static linked project covers enabled:", error.message);
    return staticApi;
  }
  return {
    select(delta) {
      if (fallbackMode) {
        fallbackSelect(delta);
        return;
      }
      target = (Math.round(current / step) + delta) * step - scrollOffset;
    },
    setScroll(progress) {
      scrollProgress = progress;
      scrollOffset = progress * step * 3;
    },
    update(delta) {
      if (disposed || !visible || document.hidden || fallbackMode) return;
      const desired = target + scrollOffset,
        velocity = desired - current;
      const pointerMoving = pointer.distanceToSquared(targetPointer) > 0.00001;
      if (Math.abs(velocity) < 0.0001 && !needsRender && !pointerMoving) return;
      const dt = Math.min(delta, 0.05);
      current = THREE.MathUtils.damp(current, desired, dragging ? 15 : 8, dt);
      pointer.lerp(targetPointer, 1 - Math.exp(-6 * dt));
      const rounded = ((Math.round(current / step) % 4) + 4) % 4;
      if (rounded !== selected) emit(rounded);
      group.rotation.set(
        pointer.y * 0.035,
        0,
        pointer.x * 0.02 - 0.055 * (1 - Math.min(scrollProgress * 8, 1)),
      );
      group.position.y = pointer.y * -0.04;
      for (let i = 0; i < meshes.length; i++) {
        const angle = i * step - current;
        meshes[i].visible = Math.cos(angle) > 0.05;
        meshes[i].position.set(
          Math.sin(angle) * 7,
          Math.sin(angle) * 0.1,
          Math.cos(angle) * 7 - 7,
        );
        meshes[i].rotation.set(0, angle, -0.018 * Math.sin(angle));
        meshes[i].material.uniforms.uVelocity.value = velocity;
        meshes[i].material.uniforms.uShade.value =
          0.84 + 0.16 * Math.max(0, Math.cos(angle));
      }
      renderer.render(scene, camera);
      if (!announced) {
        announced = true;
        onSelect(works[selected], selected);
        onReady?.(true);
      }
      needsRender = false;
    },
    dispose,
  };
}
