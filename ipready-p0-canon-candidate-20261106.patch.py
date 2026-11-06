#!/usr/bin/env python3
"""ipready P0 patch: absolute blog links, trailing-slash 301, canonical (canon1106).

Base: the live build serving news1106 (entry
      Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.js).
Changes:
  1. /blog list: article links href="blog/<slug>" (relative) -> "/blog/<slug>"
     (featured card + every card; client chunk and its SSR copy). No other
     relative blog/ link exists in the active build.
  2. Trailing slash: a new first middleware in nitro.mjs answers GET/HEAD page
     paths ending in "/" (root excepted) with a 301 to the same path without the
     trailing slash(es), query string kept. Not applied to /api/*, /_nuxt/*,
     /blog-covers/*, /__nuxt*, paths whose last segment has an extension, or
     paths starting with "//" or "/\\" (no open redirect).
  3. Canonical: <link rel="canonical"> on /, /check, /batch-check, /resources,
     /blog and every /blog/<slug>, value https://ipready.cc<path without slash>.
     Added to each page's existing useHead (client chunk + SSR copy), so it is
     in the server HTML, kept on hydration and switched on client navigation.
     Admin pages and APIs are not touched.
Because /_nuxt/ assets are immutable-cached, every changed chunk and every
active chunk that imports one (here only the entry) is written as a new
.canon1106 file; the old files stay in place untouched. Server modules are
edited in place (they are not cache-named).

Usage:  python3 -I patch_canon.py <path to .output, or the folder that contains it> [--check]

Safety (same contract as the earlier v2 patches):
  * Preflight: every input file must match its expected SHA-256 and no output
    file may exist yet. Otherwise nothing is written (exit 2).
  * Already patched: reports ALREADY APPLIED and exits 0 without writing.
  * Builds everything in memory; each anchor must match its expected count and
    every result must match the verified candidate SHA-256 before writing.
  * --check runs everything except the writes.
"""
import base64, hashlib, os, sys

TAG = 'canon1106'
SITE = 'https://ipready.cc'
ENTRY = 'Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.js'
BLOG, RES, BATCH, CHECK, HOME, POSTP = ('CvORIAsC.news1106.js', 'BPulv7zN2.news1106.js', 'CczsPb3K.poster1103.news1106.js',
                                        'CsmPqC0c.color1105.news1106.js', 'D2Uo64ua2.poster1103.color1105.news1106.js', 'fe8h-uHL.seo1103.news1106.js')
CHAIN = [BLOG, RES, BATCH, CHECK, HOME, POSTP, ENTRY]  # changed page chunks + the entry (their only importer)
NEW = {f: f[:-3] + f'.{TAG}.js' for f in CHAIN}
R_RENDER, R_MANIFEST, R_ASSETS = 'server/chunks/routes/renderer.mjs', 'server/chunks/virtual/precomputed.mjs', 'server/chunks/nitro/nitro.mjs'
SSR = {  # SSR copy of each page -> canonical href expression (JS template literal body)
    'server/chunks/build/pages-BuNf1zPR.mjs': f'"{SITE}/"',
    'server/chunks/build/check-CCkgP7so.mjs': f'"{SITE}/check"',
    'server/chunks/build/batch-check-D1VnV_s1.mjs': f'"{SITE}/batch-check"',
    'server/chunks/build/resources-CkDo594k.mjs': f'"{SITE}/resources"',
    'server/chunks/build/blog-D2gIckYV.mjs': f'"{SITE}/blog"',
    'server/chunks/build/_slug_-DcBDuRpJ.mjs': f'`{SITE}/blog/${{post.value.slug}}`',
}
R_SSR_BLOG = 'server/chunks/build/blog-D2gIckYV.mjs'
CLIENT_CANON = {HOME: f'`{SITE}/`', CHECK: f'`{SITE}/check`', BATCH: f'`{SITE}/batch-check`', RES: f'`{SITE}/resources`',
                BLOG: f'`{SITE}/blog`', POSTP: f'`{SITE}/blog/${{X.value.slug}}`'}
SLASH_MW = '''const _canon1106_slash = defineEventHandler((event) => {
  if (event.method !== "GET" && event.method !== "HEAD") return;
  const url = event.path || "/";
  const q = url.indexOf("?");
  const pathname = q === -1 ? url : url.slice(0, q);
  if (pathname.length < 2 || !pathname.endsWith("/")) return;
  if (pathname[1] === "/" || pathname[1] === "\\\\") return;
  if (/^\\/(?:api|_nuxt|blog-covers|__nuxt[^/]*)(?:\\/|$)/.test(pathname)) return;
  const target = pathname.replace(/\\/+$/, "");
  if (!target || /\\.[^/]*$/.test(target)) return;
  return sendRedirect(event, target + (q === -1 ? "" : url.slice(q)), 301);
});

'''
pub = lambda n: f'public/_nuxt/{n}'

PRE = {  # live news1106 (public files byte-identical to https://ipready.cc/_nuxt/), server files from the verified news1106 candidate
    pub(BLOG): '4e270c51afb9d6541d2339bf0dba65becba68fc1852c2b45072fc4f6af1a5eff',
    pub(RES): '189f579a0277a9dad67cdd11df4b149634ceabf0e6ff886c576670068e8f7894',
    pub(BATCH): 'a3a79ce963a788f7ab3bd64f5038501d119decfd5d808dadfce4fae5dbca1f6f',
    pub(CHECK): '5c9aeba3c4e2df81c21d9ad2d23817a20da5a3dc59f6d3ac7587a5f57eac99e9',
    pub(HOME): 'e1470c7c63f42e58fc814984bba588bc4fe4ab6b53f6ea644cfeed1c37e62618',
    pub(POSTP): '6fad6792b6bd42278e953a2be6227d33dd3dd9abb8f67e882bc2ec00a54c4a67',
    pub(ENTRY): '6e90961e7a97c8e1699aecc039f9d8046c2ced383bfefa9c3b2bd1d0fb0be8ab',
    R_RENDER: '5be3a4bda757c9c3b6e0f619c8fbd95e1cadc17d2cc7b221e50adf3e09463c97',
    R_MANIFEST: '415a8b636d371d67860dc8b0b552f81b7946d4e45d3e3a11957b96c16a7c1068',
    R_ASSETS: 'cbc870de84d853b360f22dea6269996a39eb4daa06bb842c6d299de699003bad',
    'server/chunks/build/blog-D2gIckYV.mjs': 'e5896fba4b3bc74f0f38473256bac0dd73466c028247b35a837f9e9cf4494dfc',
    'server/chunks/build/check-CCkgP7so.mjs': 'f2d6de26c684327aa70fbaf78fe405f36b98513794f1f709376a8a3696e916b8',
    'server/chunks/build/pages-BuNf1zPR.mjs': '64bf089fe7c3fe6f1a3b23906b49925eafcb022cf520209740c2aa743cba5e0c',
    'server/chunks/build/resources-CkDo594k.mjs': '41eba837e7bc2ba9d959bf3e74c27c5cd7fc0daa7e9b038cd66eeb72c8c99849',
    'server/chunks/build/batch-check-D1VnV_s1.mjs': '3bf738e0dd33960eab7b9ed4acbb02755601c11064a0344762166d44cdd857bf',
    'server/chunks/build/_slug_-DcBDuRpJ.mjs': '12a7dfe81eabea28f721414a98e8533537540076ff1e4581cee27a6d4ff4b377',
}
GATE = {  # read-only baseline checks: must match, never written (news1106 server-side category validation)
    'server/chunks/_/blog-store.mjs': 'af22d705f5f5bec9f7fd6d81ee8e1357a8412a86ef47e03ad2d7e2b6873c6482',
}
POST = {  # verified candidate
    'public/_nuxt/CvORIAsC.news1106.canon1106.js': 'f0566b945af2c574e81551e9a6612b86829a4a171d4e9033a51818fed5c8f1f2',
    'public/_nuxt/BPulv7zN2.news1106.canon1106.js': '615bc3603130fdb5986d56675ee88637aeea990832414060d96b49415975a77c',
    'public/_nuxt/CczsPb3K.poster1103.news1106.canon1106.js': '75504b09bc43aef007f165cf829648937d10e01bed6a6d98c0ae856c1070daeb',
    'public/_nuxt/CsmPqC0c.color1105.news1106.canon1106.js': 'b09420bab62d853242e85bf01187c04f307c1d7256dcb569649c11ca33221a4b',
    'public/_nuxt/D2Uo64ua2.poster1103.color1105.news1106.canon1106.js': '8c9e0a3130094771245810b2f17553347ad643a74d36db4c49a3775de87140d5',
    'public/_nuxt/fe8h-uHL.seo1103.news1106.canon1106.js': '181f16f888d63834cd70e2b85302f92fa2337fb76f2d503ad2c9f1376822b4b0',
    'public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.canon1106.js': '201bed047bcd5c85e350ff2f74a0ee3cdbb8588ab31f338903018fa2ba52ffc4',
    'server/chunks/routes/renderer.mjs': '85ac332e8951891d3c13edb0c0a8ba38dae89e0726c32079a83aa7bee0e59429',
    'server/chunks/virtual/precomputed.mjs': 'ce559973c137243a33ab622f6619b89719daf50fac4475d27d11b02df024388e',
    'server/chunks/nitro/nitro.mjs': 'eb0b65f605961b20fefa51fab9ae2fffd816d479ab5092c70ac089cdc0329c0d',
    'server/chunks/build/pages-BuNf1zPR.mjs': 'e2c48cad195c61910aa2f86cf9aebfa194b7e837f4dbc9f0a6025eaf39a0b9e4',
    'server/chunks/build/check-CCkgP7so.mjs': '215bc352887eb194ec3154d4aa28e7d9c12953ad385dfbfa4ad62049f701b1e5',
    'server/chunks/build/batch-check-D1VnV_s1.mjs': 'ae9f9192c71acaa0decdc7d676c62e3b398304362ec764124bb42f98758a02c9',
    'server/chunks/build/resources-CkDo594k.mjs': '1ba567960d91903685dcbc5fb027b55d7d7c26c5ee7ff5c8ae71d32cd1fd4aea',
    'server/chunks/build/blog-D2gIckYV.mjs': '6193d1dd211b09d97e79ca6d808e97785c5d0f134012143623e1305f96806407',
    'server/chunks/build/_slug_-DcBDuRpJ.mjs': '364f18e2b01b452ae9b27803f8edce44380d5ddebe505e78c4c491072c37f1f5',
}

def sha(b): return hashlib.sha256(b).hexdigest()
def die(msg, code=2): print('ABORT:', msg, '\nNothing was written.'); sys.exit(code)

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check_only = '--check' in sys.argv
    if len(args) != 1: die(__doc__)
    O = os.path.abspath(args[0])
    if os.path.basename(O) != '.output' and os.path.isdir(os.path.join(O, '.output')): O = os.path.join(O, '.output')
    if not os.path.isfile(os.path.join(O, R_RENDER)): die(f'{O} does not look like a Nuxt .output folder ({R_RENDER} missing)')
    def rd(rel):
        p = os.path.join(O, rel); return open(p, 'rb').read() if os.path.isfile(p) else None

    if POST and all(rd(k) is not None and sha(rd(k)) == v for k, v in POST.items()):
        print(f'ALREADY APPLIED: all {len(POST)} output files match the verified candidate. Nothing to do.'); return
    bad = []
    for k, v in {**PRE, **GATE}.items():
        b = rd(k); h = None if b is None else sha(b)
        if h != v: bad.append(f'  {k}: {"missing" if b is None else ("ALREADY PATCHED" if POST and POST.get(k) == h else "unexpected content " + h[:12])}')
    for f in CHAIN:
        if rd(pub(NEW[f])) is not None: bad.append(f'  {pub(NEW[f])}: output file already exists')
    if bad: die('input is not the expected live baseline (news1106):\n' + '\n'.join(bad))
    print(f'preflight OK: all {len(PRE) + len(GATE)} baseline files match the expected live baseline')

    T = {k: rd(k).decode('utf-8') for k in PRE}
    def rep(text, old, new, label, expect=1):
        n = text.count(old)
        if n != expect: die(f'{label}: anchor matched {n}x, expected {expect}x: {old[:90]!r}')
        print(f'  ok  {label}: {n}x'); return text.replace(old, new)

    C = {f: T[pub(f)] for f in CHAIN}
    # 1) /blog article links: relative -> absolute
    C[BLOG] = rep(C[BLOG], 'href:`blog/${e(Q).slug}`', 'href:`/blog/${e(Q).slug}`', 'blog featured link')
    C[BLOG] = rep(C[BLOG], 'href:`blog/${r.slug}`', 'href:`/blog/${r.slug}`', 'blog card link')
    # 3) canonical (client)
    LINK = 'link:[{rel:`preconnect`,href:`https://fonts.googleapis.com`}'
    for f, href in CLIENT_CANON.items():
        C[f] = rep(C[f], LINK, 'link:[{rel:`canonical`,href:' + href + '},' + LINK[6:], f'canonical {f}')
    # renamed-chunk references inside the chain ("./X" static/preload, `./X` dynamic import)
    for f in CHAIN:
        for d in CHAIN:
            total = C[f].count('./' + d)
            if not total: continue
            n = C[f].count(f'"./{d}"') + C[f].count(f'`./{d}`')
            if n != total: die(f'{f}: reference to {d} in an unexpected form ({n} of {total})')
            C[f] = C[f].replace(f'"./{d}"', f'"./{NEW[d]}"').replace(f'`./{d}`', f'`./{NEW[d]}`')
        left = [d for d in CHAIN if C[f].count(f'"./{d}"') + C[f].count(f'`./{d}`')]
        if left: die(f'{f}: old references left: {left}')
    out = {pub(NEW[f]): C[f] for f in CHAIN}

    out[R_RENDER] = rep(T[R_RENDER], f'const entryFileName = "{ENTRY}";', f'const entryFileName = "{NEW[ENTRY]}";', 'renderer entryFileName')
    m = T[R_MANIFEST]
    for f in CHAIN:
        m = rep(m, f'file:"{f}"', f'file:"{NEW[f]}"', f'manifest file {f}', expect=2)
    out[R_MANIFEST] = m
    a = T[R_ASSETS]
    for f in CHAIN:
        data = out[pub(NEW[f])].encode('utf-8')
        etag = '\\"%x-%s\\"' % (len(data), base64.b64encode(hashlib.sha1(data).digest()).decode()[:27])
        row = f'"/_nuxt/{NEW[f]}": {{"type":"text/javascript","etag":"{etag}","mtime":"2026-11-06T12:00:00.000Z","size":{len(data)},"path":"../public/_nuxt/{NEW[f]}"}},\n  '
        a = rep(a, f'"/_nuxt/{f}": ', row + f'"/_nuxt/{f}": ', f'asset table row {f}')
    # 2) trailing-slash 301 middleware, registered first
    a = rep(a, '\nconst handlers = [\n', '\n' + SLASH_MW + 'const handlers = [\n'
            "  { route: '', handler: _canon1106_slash, lazy: false, middleware: true, method: undefined },\n", 'slash middleware')
    out[R_ASSETS] = a
    # SSR copies: blog links + canonical
    s = T[R_SSR_BLOG]
    s = rep(s, 'ssrRenderAttr("href", `blog/${unref(FEATURED).slug}`)', 'ssrRenderAttr("href", `/blog/${unref(FEATURED).slug}`)', 'SSR blog featured link')
    s = rep(s, 'ssrRenderAttr("href", `blog/${post.slug}`)', 'ssrRenderAttr("href", `/blog/${post.slug}`)', 'SSR blog card link')
    T[R_SSR_BLOG] = s
    SLINK = '\t\t\tlink: [\n\t\t\t\t{\n\t\t\t\t\trel: "preconnect",\n\t\t\t\t\thref: "https://fonts.googleapis.com"\n'
    for k, href in SSR.items():
        out[k] = rep(T[k], SLINK, '\t\t\tlink: [\n\t\t\t\t{\n\t\t\t\t\trel: "canonical",\n\t\t\t\t\thref: ' + href + '\n\t\t\t\t},\n' + SLINK[11:],
                     f'SSR canonical {k.rsplit("/", 1)[1]}')

    enc = {k: v.encode('utf-8') for k, v in out.items()}
    if POST is None:
        print('POST hashes (generation mode):'); [print(f'    {k!r}: {sha(b)!r},') for k, b in enc.items()]
    else:
        wrong = [k for k in POST if k not in enc or sha(enc[k]) != POST[k]] + [k for k in enc if k not in POST]
        if wrong: die('result differs from the verified candidate: ' + ', '.join(wrong))
        print(f'result OK: all {len(POST)} outputs match the verified candidate SHA-256')
    if check_only: print('--check: no files written'); return
    for k, b in enc.items():
        p = os.path.join(O, k); tmp = p + f'.tmp-{TAG}'
        with open(tmp, 'wb') as f: f.write(b)
        os.replace(tmp, p)
    print(f'APPLIED: wrote {len(CHAIN)} new files, updated {len(enc) - len(CHAIN)} server files ({TAG})')

if __name__ == '__main__':
    main()
