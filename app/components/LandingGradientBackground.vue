<template>
  <div class="landing-gradient" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
</template>

<style scoped>
/* Match the closing CTA's blue / green mesh, scaling its softness with this smaller frame. */
.landing-gradient { position: absolute; z-index: -1; inset: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg, #f5f9fc 0%, #edf5fb 48%, #d4e8ff 100%); }
.landing-gradient span { position: absolute; border-radius: 50%; filter: blur(7cqw); }
.landing-gradient span:nth-child(1) { bottom: -70%; left: -12%; width: 88%; height: 118%; background: #8ec5ff; opacity: .9; animation: landing-mesh-a 18s ease-in-out infinite alternate; }
.landing-gradient span:nth-child(2) { bottom: -65%; right: -14%; width: 78%; height: 112%; background: #3fd17a; opacity: .7; animation: landing-mesh-b 22s ease-in-out infinite alternate; }
.landing-gradient span:nth-child(3) { bottom: -30%; left: 24%; width: 52%; height: 67%; background: #d8f6e6; opacity: .95; animation: landing-mesh-c 26s ease-in-out infinite alternate; }
.landing-gradient span:nth-child(4) { bottom: -38%; right: -4%; width: 48%; height: 69%; background: #128a4c; opacity: .55; animation: landing-mesh-b 20s ease-in-out infinite alternate-reverse; }
.landing-gradient span:nth-child(5) { bottom: -42%; left: -8%; width: 69%; height: 78%; background: #dff5b8; opacity: .55; animation: landing-mesh-a 24s ease-in-out infinite alternate-reverse; }
.landing-gradient::before { content: ''; position: absolute; z-index: 1; inset: 0; pointer-events: none; background: rgba(0,0,0,.02); }
.landing-gradient::after { content: ''; position: absolute; z-index: 1; inset: 0; pointer-events: none; opacity: .18; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
@keyframes landing-mesh-a { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(-8%, 3%, 0) scale(1.12); } }
@keyframes landing-mesh-b { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(8%, -3%, 0) scale(1.08); } }
@keyframes landing-mesh-c { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-10%, -4%, 0); } }
@media (prefers-reduced-motion: reduce) { .landing-gradient span { animation: none; } }
</style>
