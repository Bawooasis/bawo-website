var L=Object.defineProperty;var F=(t,e,r)=>e in t?L(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var a=(t,e,r)=>F(t,typeof e!="symbol"?e+"":e,r);import{r as g,j as M}from"./three-BVBiHVO-.js";const D=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,y=1920*1080*4;let W=class{constructor(e,r,i,l,o=0,s=0,n=2,u=y,h=[]){a(this,"parentElement");a(this,"canvasElement");a(this,"gl");a(this,"program",null);a(this,"uniformLocations",{});a(this,"fragmentShader");a(this,"rafId",null);a(this,"lastRenderTime",0);a(this,"currentFrame",0);a(this,"speed",0);a(this,"currentSpeed",0);a(this,"providedUniforms");a(this,"mipmaps",[]);a(this,"hasBeenDisposed",!1);a(this,"resolutionChanged",!0);a(this,"textures",new Map);a(this,"minPixelRatio");a(this,"maxPixelCount");a(this,"isSafari",G());a(this,"uniformCache",{});a(this,"textureUnitMap",new Map);a(this,"ownerDocument");a(this,"initProgram",()=>{const e=C(this.gl,D,this.fragmentShader);e&&(this.program=e)});a(this,"setupPositionAttribute",()=>{const e=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);const i=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(i),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)});a(this,"setupUniforms",()=>{const e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,i])=>{if(e[r]=this.gl.getUniformLocation(this.program,r),i instanceof HTMLImageElement){const l=`${r}AspectRatio`;e[l]=this.gl.getUniformLocation(this.program,l)}}),this.uniformLocations=e});a(this,"renderScale",1);a(this,"parentWidth",0);a(this,"parentHeight",0);a(this,"parentDevicePixelWidth",0);a(this,"parentDevicePixelHeight",0);a(this,"devicePixelsSupported",!1);a(this,"resizeObserver",null);a(this,"setupResizeObserver",()=>{this.resizeObserver=new ResizeObserver(([e])=>{var r;if(e!=null&&e.borderBoxSize[0]){const i=(r=e.devicePixelContentBoxSize)==null?void 0:r[0];i!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=i.inlineSize,this.parentDevicePixelHeight=i.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)});a(this,"handleVisualViewportChange",()=>{var e;(e=this.resizeObserver)==null||e.disconnect(),this.setupResizeObserver()});a(this,"handleResize",()=>{let e=0,r=0;const i=Math.max(1,window.devicePixelRatio),l=(visualViewport==null?void 0:visualViewport.scale)??1;if(this.devicePixelsSupported){const c=Math.max(1,this.minPixelRatio/i);e=this.parentDevicePixelWidth*c*l,r=this.parentDevicePixelHeight*c*l}else{let c=Math.max(i,this.minPixelRatio)*l;if(this.isSafari){const f=j(this.ownerDocument);c*=Math.max(1,f)}e=Math.round(this.parentWidth)*c,r=Math.round(this.parentHeight)*c}const o=Math.sqrt(this.maxPixelCount)/Math.sqrt(e*r),s=Math.min(1,o),n=Math.round(e*s),u=Math.round(r*s),h=n/Math.round(this.parentWidth);(this.canvasElement.width!==n||this.canvasElement.height!==u||this.renderScale!==h)&&(this.renderScale=h,this.canvasElement.width=n,this.canvasElement.height=u,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))});a(this,"render",e=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}const r=e-this.lastRenderTime;this.lastRenderTime=e,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null});a(this,"requestRender",()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)});a(this,"setTextureUniform",(e,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);const i=this.textures.get(e);i&&this.gl.deleteTexture(i),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);const l=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+l);const o=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,o),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));const s=this.gl.getError();if(s!==this.gl.NO_ERROR||o===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(e,o);const n=this.uniformLocations[e];if(n){this.gl.uniform1i(n,l);const u=`${e}AspectRatio`,h=this.uniformLocations[u];if(h){const c=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(h,c)}}});a(this,"areUniformValuesEqual",(e,r)=>e===r?!0:Array.isArray(e)&&Array.isArray(r)&&e.length===r.length?e.every((i,l)=>this.areUniformValuesEqual(i,r[l])):!1);a(this,"setUniformValues",e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([r,i])=>{let l=i;if(i instanceof HTMLImageElement&&(l=`${i.src.slice(0,200)}|${i.naturalWidth}x${i.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],l))return;this.uniformCache[r]=l;const o=this.uniformLocations[r];if(!o){console.warn(`Uniform location for ${r} not found`);return}if(i instanceof HTMLImageElement)this.setTextureUniform(r,i);else if(Array.isArray(i)){let s=null,n=null;if(i[0]!==void 0&&Array.isArray(i[0])){const u=i[0].length;if(i.every(h=>h.length===u))s=i.flat(),n=u;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=i,n=s.length;switch(n){case 2:this.gl.uniform2fv(o,s);break;case 3:this.gl.uniform3fv(o,s);break;case 4:this.gl.uniform4fv(o,s);break;case 9:this.gl.uniformMatrix3fv(o,!1,s);break;case 16:this.gl.uniformMatrix4fv(o,!1,s);break;default:console.warn(`Unsupported uniform array length: ${n}`)}}else typeof i=="number"?this.gl.uniform1f(o,i):typeof i=="boolean"?this.gl.uniform1i(o,i?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof i}`)})});a(this,"getCurrentFrame",()=>this.currentFrame);a(this,"setFrame",e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())});a(this,"setSpeed",(e=1)=>{this.speed=e,this.setCurrentSpeed(this.ownerDocument.hidden?0:e)});a(this,"setCurrentSpeed",e=>{this.currentSpeed=e,this.rafId===null&&e!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&e===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)});a(this,"setMaxPixelCount",(e=y)=>{this.maxPixelCount=e,this.handleResize()});a(this,"setMinPixelRatio",(e=2)=>{this.minPixelRatio=e,this.handleResize()});a(this,"setUniforms",e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())});a(this,"handleDocumentVisibilityChange",()=>{this.setCurrentSpeed(this.ownerDocument.hidden?0:this.speed)});a(this,"dispose",()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),visualViewport==null||visualViewport.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount});if((e==null?void 0:e.nodeType)===1)this.parentElement=e;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const x=this.ownerDocument.createElement("style");x.innerHTML=H,x.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(x)}const c=this.ownerDocument.createElement("canvas");this.canvasElement=c,this.parentElement.prepend(c),this.fragmentShader=r,this.providedUniforms=i,this.mipmaps=h,this.currentFrame=s,this.minPixelRatio=n,this.maxPixelCount=u;const f=c.getContext("webgl2",l);if(!f)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=f,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport==null||visualViewport.addEventListener("resize",this.handleVisualViewportChange),this.setSpeed(o),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}};function B(t,e,r){const i=t.createShader(e);return i?(t.shaderSource(i,r),t.compileShader(i),t.getShaderParameter(i,t.COMPILE_STATUS)?i:(console.error("An error occurred compiling the shaders: "+t.getShaderInfoLog(i)),t.deleteShader(i),null)):null}function C(t,e,r){const i=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT),l=i?i.precision:null;l&&l<23&&(e=e.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));const o=B(t,t.VERTEX_SHADER,e),s=B(t,t.FRAGMENT_SHADER,r);if(!o||!s)return null;const n=t.createProgram();return n?(t.attachShader(n,o),t.attachShader(n,s),t.linkProgram(n),t.getProgramParameter(n,t.LINK_STATUS)?(t.detachShader(n,o),t.detachShader(n,s),t.deleteShader(o),t.deleteShader(s),n):(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(n)),t.deleteProgram(n),t.deleteShader(o),t.deleteShader(s),null)):null}const H=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function G(){const t=navigator.userAgent.toLowerCase();return t.includes("safari")&&!t.includes("chrome")&&!t.includes("android")}function j(t){const e=(visualViewport==null?void 0:visualViewport.scale)??1,r=(visualViewport==null?void 0:visualViewport.width)??window.innerWidth,i=window.innerWidth-t.documentElement.clientWidth,l=e*r+i,o=outerWidth/l,s=Math.round(100*o);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:o}const X={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},$={none:0,contain:1,cover:2},N=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,Y=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,q=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`,z={maxColorCount:10},k=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${z.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${N}
${Y}
${q}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = v_objectUV;
  uv += .5;
  vec2 grainUV = uv * 1000.;

  float grain = noise(grainUV, vec2(0.));
  float mixerGrain = .4 * u_grainMixer * (grain - .5);

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time + firstFrameOffset);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec2 uvRotated = uv;
  uvRotated -= vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < ${z.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, t) + mixerGrain;
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);

    dist = pow(dist, 3.5);
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;function K(t){if(Array.isArray(t))return t.length===4?t:t.length===3?[...t,1]:w;if(typeof t!="string")return w;let e,r,i,l=1;if(t.startsWith("#"))[e,r,i,l]=Z(t);else if(t.startsWith("rgb"))[e,r,i,l]=Q(t);else if(t.startsWith("hsl"))[e,r,i,l]=ee(J(t));else return console.error("Unsupported color format",t),w;return[U(e,0,1),U(r,0,1),U(i,0,1),U(l,0,1)]}function Z(t){t=t.replace(/^#/,""),t.length===3&&(t=t.split("").map(o=>o+o).join("")),t.length===6&&(t=t+"ff");const e=parseInt(t.slice(0,2),16)/255,r=parseInt(t.slice(2,4),16)/255,i=parseInt(t.slice(4,6),16)/255,l=parseInt(t.slice(6,8),16)/255;return[e,r,i,l]}function Q(t){const e=t.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0")/255,parseInt(e[2]??"0")/255,parseInt(e[3]??"0")/255,e[4]===void 0?1:parseFloat(e[4])]:[0,0,0,1]}function J(t){const e=t.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0"),parseInt(e[2]??"0"),parseInt(e[3]??"0"),e[4]===void 0?1:parseFloat(e[4])]:[0,0,0,1]}function ee(t){const[e,r,i,l]=t,o=e/360,s=r/100,n=i/100;let u,h,c;if(r===0)u=h=c=n;else{const f=(v,S,m)=>(m<0&&(m+=1),m>1&&(m-=1),m<.16666666666666666?v+(S-v)*6*m:m<.5?S:m<.6666666666666666?v+(S-v)*(.6666666666666666-m)*6:v),x=n<.5?n*(1+s):n+s-n*s,R=2*n-x;u=f(R,x,o+1/3),h=f(R,x,o),c=f(R,x,o-1/3)}return[u,h,c,l]}const U=(t,e,r)=>Math.min(Math.max(t,e),r),w=[0,0,0,1],te="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function ie(t){const e=g.useRef(void 0),r=g.useCallback(i=>{const l=t.map(o=>{if(o!=null){if(typeof o=="function"){const s=o,n=s(i);return typeof n=="function"?n:()=>{s(null)}}return o.current=i,()=>{o.current=null}}});return()=>{l.forEach(o=>o==null?void 0:o())}},t);return g.useMemo(()=>t.every(i=>i==null)?null:i=>{e.current&&(e.current(),e.current=void 0),i!=null&&(e.current=r(i))},t)}function V(t){if(t.naturalWidth<1024&&t.naturalHeight<1024){if(t.naturalWidth<1||t.naturalHeight<1)return;const e=t.naturalWidth/t.naturalHeight;t.width=Math.round(e>1?1024*e:1024),t.height=Math.round(e>1?1024:1024/e)}}async function T(t){const e={},r=[],i=o=>{try{return o.startsWith("/")||new URL(o),!0}catch{return!1}},l=o=>{try{return o.startsWith("/")?!1:new URL(o,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(t).forEach(([o,s])=>{if(typeof s=="string"){const n=s||te;if(!i(n)){console.warn(`Uniform "${o}" has invalid URL "${n}". Skipping image loading.`);return}const u=new Promise((h,c)=>{const f=new Image;l(n)&&(f.crossOrigin="anonymous"),f.onload=()=>{V(f),e[o]=f,h()},f.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${n}`),c()},f.src=n});r.push(u)}else s instanceof HTMLImageElement&&V(s),e[o]=s}),await Promise.all(r),e}const O=g.forwardRef(function({fragmentShader:e,uniforms:r,webGlContextAttributes:i,speed:l=0,frame:o=0,width:s,height:n,minPixelRatio:u,maxPixelCount:h,mipmaps:c,style:f,...x},R){const[v,S]=g.useState(!1),m=g.useRef(null),_=g.useRef(null),E=g.useRef(i);g.useEffect(()=>((async()=>{const b=await T(r);m.current&&!_.current&&(_.current=new W(m.current,e,b,E.current,l,o,u,h,c),S(!0))})(),()=>{var b;(b=_.current)==null||b.dispose(),_.current=null}),[e]),g.useEffect(()=>{let p=!1;return(async()=>{var A;const I=await T(r);p||(A=_.current)==null||A.setUniforms(I)})(),()=>{p=!0}},[r,v]),g.useEffect(()=>{var p;(p=_.current)==null||p.setSpeed(l)},[l,v]),g.useEffect(()=>{var p;(p=_.current)==null||p.setMaxPixelCount(h)},[h,v]),g.useEffect(()=>{var p;(p=_.current)==null||p.setMinPixelRatio(u)},[u,v]),g.useEffect(()=>{var p;(p=_.current)==null||p.setFrame(o)},[o,v]);const P=ie([m,R]);return M.jsx("div",{ref:P,style:s!==void 0||n!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof n=="string"&&isNaN(+n)===!1?+n:n,...f}:f,...x})});O.displayName="ShaderMount";function re(t,e){var r,i,l;for(const o in t){if(o==="colors"){const s=Array.isArray(t.colors),n=Array.isArray(e.colors);if(!s||!n){if(Object.is(t.colors,e.colors)===!1)return!1;continue}if(((r=t.colors)==null?void 0:r.length)!==((i=e.colors)==null?void 0:i.length)||!((l=t.colors)!=null&&l.every((u,h)=>{var c;return u===((c=e.colors)==null?void 0:c[h])})))return!1;continue}if(Object.is(t[o],e[o])===!1)return!1}return!0}const d={name:"Default",params:{...X,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},ae=g.memo(function({speed:e=d.params.speed,frame:r=d.params.frame,colors:i=d.params.colors,distortion:l=d.params.distortion,swirl:o=d.params.swirl,grainMixer:s=d.params.grainMixer,grainOverlay:n=d.params.grainOverlay,fit:u=d.params.fit,rotation:h=d.params.rotation,scale:c=d.params.scale,originX:f=d.params.originX,originY:x=d.params.originY,offsetX:R=d.params.offsetX,offsetY:v=d.params.offsetY,worldWidth:S=d.params.worldWidth,worldHeight:m=d.params.worldHeight,..._}){const E={u_colors:i.map(K),u_colorsCount:i.length,u_distortion:l,u_swirl:o,u_grainMixer:s,u_grainOverlay:n,u_fit:$[u],u_rotation:h,u_scale:c,u_offsetX:R,u_offsetY:v,u_originX:f,u_originY:x,u_worldWidth:S,u_worldHeight:m};return M.jsx(O,{..._,speed:e,frame:r,fragmentShader:k,uniforms:E})},re);export{ae as M};
