import { registerHooks } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

// Test-only adapter: actual routes/services run with mocked bindings and HTTP.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/currentUser') return { url: new URL('./current-user.mjs', import.meta.url).href, shortCircuit: true };
    if (specifier.startsWith('./') && context.parentURL?.includes('/src/lib/')) {
      const candidate = new URL(specifier + '.ts', context.parentURL);
      if (existsSync(candidate)) return { url: candidate.href, shortCircuit: true };
    }
    if (specifier === 'cloudflare:workers') return { url: new URL('./worker-env.mjs', import.meta.url).href, shortCircuit: true };
    if (specifier.startsWith('@/')) {
      const path = fileURLToPath(new URL(`../src/${specifier.slice(2)}`, import.meta.url));
      return { url: pathToFileURL(existsSync(`${path}.ts`) ? `${path}.ts` : `${path}.tsx`).href, shortCircuit: true };
    }
    if (specifier === 'next/server') return nextResolve('next/server.js', context);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts') || url.endsWith('.tsx')) {
      return { format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, fileName: fileURLToPath(url),
      }).outputText };
    }
    return nextLoad(url, context);
  },
});
