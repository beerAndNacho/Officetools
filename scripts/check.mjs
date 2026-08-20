import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { TOOLS } from '../src/catalog.js';

const expectedModes = new Set(['transform','generator','calculator','timer','utility','validator']);
const ids = TOOLS.map((tool) => tool.id);
const slugs = TOOLS.map((tool) => tool.slug);
if (TOOLS.length !== 100) throw new Error(`Expected 100 tools, got ${TOOLS.length}`);
if (new Set(ids).size !== 100 || new Set(slugs).size !== 100) throw new Error('Duplicate id or slug detected.');
for (let id = 1; id <= 100; id += 1) if (!ids.includes(id)) throw new Error(`Missing tool ${id}`);
for (const tool of TOOLS) {
  if (!tool.title || !tool.description || !tool.category || !tool.slug) throw new Error(`Incomplete metadata: ${tool.id}`);
  if (!expectedModes.has(tool.mode)) throw new Error(`Unsupported mode: ${tool.id} ${tool.mode}`);
  if (!tool.operation) throw new Error(`Missing operation: ${tool.id}`);
  if (!Array.isArray(tool.fields) || tool.fields.length === 0) throw new Error(`Missing fields: ${tool.id}`);
  if (tool.mode === 'generator' && tool.operation === 'template' && !tool.template) throw new Error(`Missing template: ${tool.id}`);
  const keys = tool.fields.map((field) => field.key);
  if (new Set(keys).size !== keys.length) throw new Error(`Duplicate field key: ${tool.id}`);
  for (const field of tool.fields) {
    if (!field.key || !field.label || !field.type) throw new Error(`Incomplete field: ${tool.id}`);
    if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length < 1)) throw new Error(`Missing select options: ${tool.id}/${field.key}`);
  }
}
const engineSource = readFileSync('src/engine.js','utf8');
const routedByMode = new Set(['template','pomodoro']);
for (const operation of new Set(TOOLS.map((tool) => tool.operation))) {
  if (routedByMode.has(operation)) continue;
  if (!engineSource.includes(`'${operation}'`) && !engineSource.includes(`"${operation}"`)) throw new Error(`Operation is not connected to engine: ${operation}`);
}
for (const file of ['src/catalog.js','src/portal.js','src/engine.js','scripts/build.mjs']) execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
console.log(`Validated ${TOOLS.length} tools, ${new Set(TOOLS.map((tool) => tool.category)).size} categories, and JavaScript syntax.`);
