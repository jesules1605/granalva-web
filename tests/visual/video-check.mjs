import { createRequire } from "node:module";
// Verificación del vídeo del hero: node tests/visual/video-check.mjs (servidor en :3000).
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
const b = await chromium.launch();
for (const [w,h,slow] of [[1920,1080,false],[1440,900,false],[390,844,false],[390,844,true]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h} });
  const p = await ctx.newPage();
  if (slow) { const c = await ctx.newCDPSession(p); await c.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1.6e6/8,uploadThroughput:7.5e5/8}); }
  const t0=Date.now();
  await p.goto("http://localhost:3000/",{waitUntil:"load"});
  const tl=Date.now()-t0;
  await p.waitForFunction(()=>{const v=document.querySelector(".hero-video");return v&&v.currentTime>1;},null,{timeout:60000}).catch(()=>{});
  const r = await p.evaluate(async()=>{const v=document.querySelector(".hero-video");
    const q0=v.getVideoPlaybackQuality(); await new Promise(r=>setTimeout(r,3000)); const q=v.getVideoPlaybackQuality();
    const bg=getComputedStyle(document.querySelector(".hero")).backgroundColor;
    window.scrollTo(0,3000); await new Promise(r=>setTimeout(r,600)); const paused=v.paused;
    return {src:v.currentSrc.split("/").pop(),t:v.currentTime.toFixed(1),dropped:q.droppedVideoFrames-q0.droppedVideoFrames,frames:q.totalVideoFrames-q0.totalVideoFrames,pausedOffscreen:paused,heroBg:bg};});
  const lcp = await p.evaluate(()=>new Promise(r=>new PerformanceObserver(l=>{const e=l.getEntries().pop();r(Math.round(e.startTime)+"ms "+(e.url||e.element?.tagName))}).observe({type:"largest-contentful-paint",buffered:true})));
  console.log(w, slow?"lenta":"rápida", "load", tl+"ms", "LCP", lcp, JSON.stringify(r));
  await ctx.close();
}
await b.close();
