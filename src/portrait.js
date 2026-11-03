import * as THREE from "three";

/** An additive portrait treatment. The original photo remains the semantic poster.
 * No generated depth map or changed facial features: only monochrome, background
 * keying, bounded pointer refraction, and scroll-driven framing. */
export async function createPortrait({ host, signal, onReady }) {
  let renderer, texture, geometry, material, observer, resizeObserver;
  let active = true,
    visible = true,
    dirty = true,
    progress = 0,
    currentProgress = 0;
  let announced = false;
  let strength = 0,
    targetStrength = 0,
    previousX = 0.5,
    previousY = 0.5;
  const pointer = new THREE.Vector2(0.5, 0.5);
  const targetPointer = new THREE.Vector2(0.5, 0.5);
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const listenTarget = document.querySelector("#home");
  const dispose = () => {
    if (!active) return;
    active = false;
    observer?.disconnect();
    resizeObserver?.disconnect();
    listenTarget.removeEventListener("pointermove", onPointer);
    listenTarget.removeEventListener("pointerleave", resetPointer);
    window.removeEventListener("blur", resetPointer);
    onReady?.(false);
    geometry?.dispose();
    material?.dispose();
    texture?.dispose();
    renderer?.dispose();
    renderer?.domElement.remove();
  };
  const onPointer = (event) => {
    if (!finePointer || event.pointerType === "touch") return;
    const r = host.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - r.left) / r.width, 0, 1);
    const y =
      1 - THREE.MathUtils.clamp((event.clientY - r.top) / r.height, 0, 1);
    targetPointer.set(x, y);
    targetStrength = Math.min(1, Math.hypot(x - previousX, y - previousY) * 14);
    previousX = x;
    previousY = y;
    dirty = true;
  };
  const resetPointer = () => {
    targetPointer.set(0.5, 0.5);
    targetStrength = 0;
    dirty = true;
  };
  signal?.addEventListener("abort", dispose, { once: true });
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5),
    );
    renderer.setClearColor(0x181818, 0);
    texture = await new THREE.TextureLoader().loadAsync("/images/portrait.jpg");
    if (signal?.aborted) {
      texture.dispose();
      renderer.dispose();
      return null;
    }
    texture.colorSpace = THREE.NoColorSpace; // Key against the original sRGB luminance.
    geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: texture },
        uAspect: { value: 1 },
        uImageAspect: { value: texture.image.width / texture.image.height },
        uPointer: { value: pointer },
        uStrength: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uAspect;
        uniform float uImageAspect;
        uniform float uStrength;
        uniform float uProgress;
        uniform vec2 uPointer;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          if (uAspect > uImageAspect) uv.x = (uv.x - 0.5) * uAspect / uImageAspect + 0.5;
          else uv.y = (uv.y - 0.5) * uImageAspect / uAspect + 0.5;
          uv = (uv - vec2(0.5, 0.55)) / (1.0 + uProgress * 0.07) + vec2(0.5, 0.55);
          uv += (uPointer - 0.5) * vec2(0.013, 0.009);
          uv.y -= uProgress * 0.022;
          vec2 direction = vUv - uPointer;
          float distanceToPointer = length(direction);
          float lens = exp(-dot(direction, direction) * 12.0);
          uv += direction * sin(distanceToPointer * 18.0) * lens * uStrength * 0.012;
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
          vec3 photo = texture2D(uMap, uv).rgb;
          float luminance = dot(photo, vec3(0.299, 0.587, 0.114));
          float subject = 1.0 - smoothstep(0.79, 0.9, luminance);
          // Luminance keying is restricted to the outer silhouette. The face,
          // neck, and clothing remain opaque so highlights never become holes.
          float head = 1.0 - smoothstep(0.9, 1.0, length((uv - vec2(0.54, 0.64)) / vec2(0.21, 0.235)));
          float torso = (1.0 - smoothstep(0.27, 0.33, abs(uv.x - 0.5))) * (1.0 - smoothstep(0.36, 0.44, uv.y));
          subject = mix(subject, 1.0, max(head, torso));
          float baseFade = smoothstep(0.04, 0.30, vUv.y);
          float alpha = subject * baseFade;
          if (alpha < 0.015) discard;
          float tone = clamp((luminance - 0.045) * 1.13, 0.0, 1.0);
          vec3 color = vec3(tone) * vec3(0.985, 1.0, 0.965);
          color *= mix(0.35, 1.0, smoothstep(0.25, 0.95, alpha));
          gl_FragColor = vec4(pow(color, vec3(2.2)), alpha);
          #include <colorspace_fragment>
        }`,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(new THREE.Mesh(geometry, material));
    host.appendChild(renderer.domElement);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      material.uniforms.uAspect.value = width / height;
      renderer.setSize(width, height);
      dirty = true;
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      dirty = true;
    });
    observer.observe(host);
    listenTarget.addEventListener("pointermove", onPointer, { passive: true });
    listenTarget.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        dispose();
      },
      { once: true },
    );
    return {
      setScroll(value) {
        if (Math.abs(progress - value) > 0.0001) {
          progress = value;
          dirty = true;
        }
      },
      update(delta) {
        if (!active || !visible || document.hidden) return;
        const dt = Math.min(delta, 0.05);
        const moving =
          pointer.distanceToSquared(targetPointer) > 0.000001 ||
          Math.abs(strength - targetStrength) > 0.001 ||
          Math.abs(currentProgress - progress) > 0.0001;
        if (!dirty && !moving) return;
        pointer.lerp(targetPointer, 1 - Math.exp(-7 * dt));
        strength = THREE.MathUtils.damp(strength, targetStrength, 8, dt);
        targetStrength *= Math.exp(-4 * dt);
        currentProgress = THREE.MathUtils.damp(
          currentProgress,
          progress,
          9,
          dt,
        );
        material.uniforms.uStrength.value = strength;
        material.uniforms.uProgress.value = currentProgress;
        renderer.render(scene, camera);
        if (!announced) {
          announced = true;
          onReady?.(true);
        }
        dirty = false;
      },
      dispose,
    };
  } catch (error) {
    dispose();
    console.info("Original portrait poster enabled:", error.message);
    return null;
  }
}
