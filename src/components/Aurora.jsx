import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import './Aurora.css';

// The Vertex Shader (defines the shape) - Unchanged
const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// The Fragment Shader (defines the color and animation of each pixel) - CORRECTED
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec3 uPrevColorStops[3];
uniform float uMixFactor;
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

// --- snoise function and other helpers are unchanged ---
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){ const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439); vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx); vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0); vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)); vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0); m = m * m; m = m * m; vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h); vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw; return 130.0 * dot(m, g); }
struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors, factor, finalColor) { int index = 0; for (int i = 0; i < 2; i++) { ColorStop currentColor = colors[i]; bool isInBetween = currentColor.position <= factor; index = int(mix(float(index), float(i), float(isInBetween))); } ColorStop currentColor = colors[index]; ColorStop nextColor = colors[index + 1]; float range = nextColor.position - currentColor.position; float lerpFactor = (factor - currentColor.position) / range; finalColor = mix(currentColor.color, nextColor.color, lerpFactor); }


void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // --- Color mixing logic is unchanged ---
  ColorStop colors[3];
  ColorStop prevColors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  prevColors[0] = ColorStop(uPrevColorStops[0], 0.0);
  prevColors[1] = ColorStop(uPrevColorStops[1], 0.5);
  prevColors[2] = ColorStop(uPrevColorStops[2], 1.0);
  vec3 rampColorNow;
  vec3 rampColorPrev;
  COLOR_RAMP(colors, uv.x, rampColorNow);
  COLOR_RAMP(prevColors, uv.x, rampColorPrev);
  vec3 rampColor = mix(rampColorPrev, rampColorNow, uMixFactor);

  // --- THE CORRECTED LINE FOR MOVEMENT ---
  // The noise function now uses the pixel's y-position (uv.y) offset by time.
  // This creates the scrolling/drifting effect.
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uv.y * 1.0 - uTime * 0.05)) * 0.5 * uAmplitude;

  // --- Rest of the shader is unchanged ---
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}`;

const GRADIENT_CYCLE = [
  ["#5227FF", "#7cff67", "#5227FF"],
  ["#0ea5e9", "#22d3ee", "#818cf8"],
  ["#f472b6", "#fb923c", "#facc15"],
  ["#34d399", "#10b981", "#3b82f6"],
  ["#c084fc", "#a78bfa", "#f472b6"]
];

const parseColor = (hex) => {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
};

// --- The React Component part is unchanged and correct ---
export default function Aurora(props) {
  const { amplitude = 1.0, blend = 0.5 } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);
  
  const transitionState = useRef({
    activeIndex: 0,
    prevIndex: 0,
    mixFactor: 1.0,
    lastSwitchTime: 0,
  });

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    ctn.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
    const canvas = gl.canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: GRADIENT_CYCLE[0].map(parseColor) },
        uPrevColorStops: { value: GRADIENT_CYCLE[0].map(parseColor) },
        uMixFactor: { value: 1.0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
    }
    window.addEventListener("resize", resize);
    resize();
    
    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      
      const time = t / 1000; // time in seconds
      const state = transitionState.current;

      const HOLD_DURATION = 5; 
      const FADE_DURATION = 2; 

      if (time - state.lastSwitchTime > HOLD_DURATION + FADE_DURATION) {
        state.lastSwitchTime = time;
        state.prevIndex = state.activeIndex;
        state.activeIndex = (state.activeIndex + 1) % GRADIENT_CYCLE.length;
      }

      const timeSinceSwitch = time - state.lastSwitchTime;
      if (timeSinceSwitch < FADE_DURATION) {
        state.mixFactor = timeSinceSwitch / FADE_DURATION;
      } else {
        state.mixFactor = 1.0;
      }
      
      program.uniforms.uTime.value = time; // Use full time for smoother movement
      program.uniforms.uMixFactor.value = state.mixFactor;
      program.uniforms.uColorStops.value = GRADIENT_CYCLE[state.activeIndex].map(parseColor);
      program.uniforms.uPrevColorStops.value = GRADIENT_CYCLE[state.prevIndex].map(parseColor);

      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={ctnDom} className="aurora-container" />;
}