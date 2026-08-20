import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOOLS } from '../src/catalog.js';

const root = resolve(process.cwd());
const dist = resolve(root,'dist');
rmSync(dist,{recursive:true,force:true});
mkdirSync(resolve(dist,'assets'),{recursive:true});
for (const file of ['catalog.js','portal.js','engine.js','styles.css']) cpSync(resolve(root,'src',file),resolve(dist,'assets',file));

const portal = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="index,follow"><meta name="theme-color" content="#f2efe7"><title>OfficeTools | 업무용 웹 도구 100개</title><meta name="description" content="텍스트, 회의, 프로젝트, 시간, 재무, 데이터, 인사, 개발 업무를 브라우저에서 처리하는 무료 업무용 도구 100개."><meta property="og:title" content="OfficeTools · 업무용 웹 도구 100개"><meta property="og:description" content="로그인 없이 브라우저에서 계산·변환·문서 생성을 처리합니다."><meta property="og:type" content="website"><link rel="canonical" href="https://beerandnacho.github.io/Officetools/"><link rel="stylesheet" href="/Officetools/assets/styles.css"></head><body><script type="module" src="/Officetools/assets/portal.js"></script></body></html>`;
writeFileSync(resolve(dist,'index.html'),portal);

for (const tool of TOOLS) {
  const dir = resolve(dist,'tools',tool.slug);
  mkdirSync(dir,{recursive:true});
  const jsonLd = JSON.stringify({
    '@context':'https://schema.org',
    '@type':'SoftwareApplication',
    name:tool.title,
    applicationCategory:'BusinessApplication',
    operatingSystem:'Any',
    isAccessibleForFree:true,
    description:tool.description,
    url:`https://beerandnacho.github.io/Officetools/tools/${tool.slug}/`
  }).replace(/</g,'\u003c');
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="index,follow"><meta name="theme-color" content="#f2efe7"><title>${tool.title} | OfficeTools</title><meta name="description" content="${tool.description}"><meta property="og:title" content="${tool.title} | OfficeTools"><meta property="og:description" content="${tool.description}"><meta property="og:type" content="website"><link rel="canonical" href="https://beerandnacho.github.io/Officetools/tools/${tool.slug}/"><link rel="stylesheet" href="/Officetools/assets/styles.css"><script type="application/ld+json">${jsonLd}</script></head><body><script>window.OFFICE_TOOL_SLUG=${JSON.stringify(tool.slug)};</script><script type="module" src="/Officetools/assets/engine.js"></script></body></html>`;
  writeFileSync(resolve(dir,'index.html'),html);
}

const urls = ['https://beerandnacho.github.io/Officetools/',...TOOLS.map((tool)=>`https://beerandnacho.github.io/Officetools/tools/${tool.slug}/`)];
writeFileSync(resolve(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url)=>`  <url><loc>${url}</loc><lastmod>2026-08-20</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(resolve(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://beerandnacho.github.io/Officetools/sitemap.xml\n');
writeFileSync(resolve(dist,'.nojekyll'),'');
console.log(`Built OfficeTools portal and ${TOOLS.length} independent tool routes.`);
