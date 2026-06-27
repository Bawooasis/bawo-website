import{r,C as d,u as f,j as e,D as g,a as h}from"./three-BnvexCI6.js";import{M as x}from"./shaders-BT87ZOjz.js";import{p as a}from"./index-B_5CXD3F.js";import"./gsap-CUwdeFQJ.js";const u={color1:a.brandCtaOrange,color2:a.obsidian.canvas,ringColor:a.heritageGold},b=`
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,j=`
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;
    
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity * 0.35);
    
    float glow = 1.0 - length(uv - 0.5) * 2.0;
    glow = pow(glow, 2.0);
    
    gl_FragColor = vec4(color * glow, glow * 0.8);
  }
`;function m({position:s,color1:t=u.color1,color2:n=u.color2}){const o=r.useRef(null),i=r.useMemo(()=>({time:{value:0},intensity:{value:1},color1:{value:new d(t)},color2:{value:new d(n)}}),[t,n]);return f(l=>{i.time.value=l.clock.elapsedTime,i.intensity.value=1+Math.sin(l.clock.elapsedTime*2)*.3}),e.jsxs("mesh",{ref:o,position:s,children:[e.jsx("planeGeometry",{args:[2,2,32,32]}),e.jsx("shaderMaterial",{uniforms:i,vertexShader:b,fragmentShader:j,transparent:!0,side:g})]})}function v({radius:s=1,position:t=[0,0,0],color:n=u.ringColor}){const o=r.useRef(null);return f(i=>{if(!o.current)return;o.current.rotation.z=i.clock.elapsedTime;const l=o.current.material;l.opacity=.35+Math.sin(i.clock.elapsedTime*3)*.2}),e.jsxs("mesh",{ref:o,position:t,children:[e.jsx("ringGeometry",{args:[s*.8,s,32]}),e.jsx("meshBasicMaterial",{color:n,transparent:!0,opacity:.45,side:g})]})}const y=[a.obsidian.canvas,"#14090E","#18100F","#3D2214"],c=.45;function w(){return e.jsxs(h,{className:"h-full w-full",camera:{position:[0,0,1.5],fov:75},gl:{alpha:!0,antialias:!0},dpr:[1,1.5],children:[e.jsx(m,{position:[0,0,-.2]}),e.jsx(m,{position:[.35,-.15,-.35],color1:a.copper.deep,color2:a.obsidian.canvas}),e.jsx(v,{radius:1.15,position:[0,0,-.1]}),e.jsx(v,{radius:.72,position:[.45,.25,-.2],color:a.brandCtaOrange})]})}function k(){return e.jsxs(e.Fragment,{children:[e.jsx(x,{className:"absolute inset-0 h-full w-full",colors:[...y],speed:c,backgroundColor:a.obsidian.canvas}),e.jsx("div",{className:"absolute inset-0 opacity-[0.22] mix-blend-soft-light",children:e.jsx(w,{})}),e.jsxs("div",{className:"absolute inset-0",children:[e.jsx("div",{className:"absolute top-1/4 left-1/3 h-32 w-32 animate-pulse rounded-full blur-3xl",style:{backgroundColor:"rgba(255, 107, 0, 0.09)",animationDuration:`${3/c}s`}}),e.jsx("div",{className:"absolute bottom-1/3 right-1/4 h-24 w-24 animate-pulse rounded-full blur-2xl",style:{backgroundColor:"rgba(212, 175, 55, 0.07)",animationDuration:`${2/c}s`,animationDelay:"1s"}}),e.jsx("div",{className:"absolute top-1/2 right-1/3 h-20 w-20 animate-pulse rounded-full blur-xl",style:{backgroundColor:"rgba(196, 123, 68, 0.08)",animationDuration:`${4/c}s`,animationDelay:"0.5s"}})]}),e.jsx("div",{className:"pointer-events-none absolute inset-0 opacity-95",style:{maskImage:"radial-gradient(ellipse 92% 72% at 50% 42%, #000 25%, transparent 78%)",WebkitMaskImage:"radial-gradient(ellipse 92% 72% at 50% 42%, #000 25%, transparent 78%)",background:"radial-gradient(ellipse 85% 42% at 50% 38%, rgba(255, 107, 0, 0.1) 0%, transparent 68%)"}}),e.jsx("div",{className:"pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-52 md:h-64",style:{background:`linear-gradient(to bottom, transparent 0%, rgba(18, 8, 15, 0.65) 55%, ${a.obsidian.canvas} 100%)`}})]})}function p(){return e.jsx("div",{className:"bawo-hero-ambient absolute inset-0","aria-hidden":!0})}function M(){const[s,t]=r.useState(!1);return r.useEffect(()=>{const n=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>t(n.matches);return o(),n.addEventListener("change",o),()=>n.removeEventListener("change",o)},[]),s}function D(){return M()?e.jsx("div",{className:"pointer-events-none absolute inset-0 z-0 overflow-hidden","aria-hidden":!0,children:e.jsx(p,{})}):e.jsx("div",{className:"pointer-events-none absolute inset-0 z-0 overflow-hidden","aria-hidden":!0,children:e.jsx(r.Suspense,{fallback:e.jsx(p,{}),children:e.jsx(k,{})})})}export{D as default};
