// Aurora.jsx
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

export default function Aurora({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 0.5,
}) {
  const containerRef = useRef(null);

  // Vertex shader
  const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  // Fragment shader
  const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m*m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  return 130.0*dot(m,vec3(a0.x*x0.x+h.x*x0.y,a0.y*x12.x+h.y*x12.z,a0.z*x12.y+h.z*x12.w));
}

struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){ \
  int index=0; for(int i=0;i<2;i++){ ColorStop currentColor=colors[i]; bool isInBetween=currentColor.position<=factor; index=int(mix(float(index),float(i),float(isInBetween))); } \
  ColorStop currentColor=colors[index]; ColorStop nextColor=colors[index+1]; float range=nextColor.position-currentColor.position; \
  float lerpFactor=(factor-currentColor.position)/range; finalColor=mix(currentColor.color,nextColor.color,lerpFactor); }

void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);
  vec3 rampColor; COLOR_RAMP(colors,uv.x,rampColor);
  float height=snoise(vec2(uv.x*2.0+uTime*0.1,uTime*0.25))*0.5*uAmplitude;
  height=exp(height); height=(uv.y*2.0-height+0.2);
  float intensity=0.6*height;
  float midPoint=0.20;
  float auroraAlpha=smoothstep(midPoint-uBlend*0.5,midPoint+uBlend*0.5,intensity);
  vec3 auroraColor=intensity*rampColor;
  fragColor=vec4(auroraColor*auroraAlpha,auroraAlpha);
}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize renderer
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    // Convert hex colors to RGB once
    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    // Initialize shader program
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    // Handle resize
    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    window.addEventListener("resize", resize);
    resize();

    // Smooth animation using delta time
    let lastTime = performance.now();
    let uTime = 0;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000; // seconds
      lastTime = now;
      uTime += delta * speed;
      program.uniforms.uTime.value = uTime;

      // Update amplitude/blend if props change
      program.uniforms.uAmplitude.value = amplitude;
      program.uniforms.uBlend.value = blend;

      renderer.render({ scene: mesh });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (container && gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, colorStops, speed]);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
