import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// ──────────────────────────────────────────────────────────────────────────────
// Research Manifest Plugin
// Scans public/Research/*.pdf at build-start (and in dev whenever files change)
// and writes public/Research/manifest.json so the React page is fully dynamic.
//
// To add rich metadata to a paper, create a sidecar file with the same name
// but .meta.json extension, e.g.  public/Research/my-paper.meta.json
// ──────────────────────────────────────────────────────────────────────────────
function researchManifestPlugin(): Plugin {
  const researchDir = path.resolve('./public/Research');
  const manifestPath = path.join(researchDir, 'manifest.json');

  function generateManifest() {
    try {
      if (!fs.existsSync(researchDir)) {
        fs.mkdirSync(researchDir, { recursive: true });
      }

      const allFiles = fs.readdirSync(researchDir);
      const pdfs = allFiles.filter(
        (f) => f.toLowerCase().endsWith('.pdf')
      );

      const papers = pdfs.map((filename) => {
        // Try to load companion metadata sidecar
        const metaFilename = filename.replace(/\.pdf$/i, '.meta.json');
        const metaPath = path.join(researchDir, metaFilename);
        let meta: Record<string, unknown> = {};
        if (fs.existsSync(metaPath)) {
          try {
            meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          } catch {
            console.warn(`[research-manifest] Could not parse ${metaFilename}`);
          }
        }

        const stats = fs.statSync(path.join(researchDir, filename));
        const nameWithoutExt = filename
          .replace(/\.pdf$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          filename,
          url: `/Research/${filename}`,
          sizeBytes: stats.size,
          title: nameWithoutExt,          // default – meta.json can override
          ...meta,                        // meta.json values take precedence
        };
      });

      fs.writeFileSync(manifestPath, JSON.stringify(papers, null, 2));
      console.log(
        `[research-manifest] manifest.json updated — ${papers.length} paper(s) found.`
      );
    } catch (err) {
      console.error('[research-manifest] Failed to generate manifest:', err);
    }
  }

  return {
    name: 'research-manifest',

    // Called on every build (including first `npm run dev`)
    buildStart() {
      generateManifest();
    },

    // In dev mode: watch the Research folder and re-generate on any change
    configureServer(server) {
      server.watcher.add(researchDir);

      const refresh = (filePath: string) => {
        if (
          filePath.startsWith(path.normalize(researchDir)) &&
          !filePath.endsWith('manifest.json')
        ) {
          generateManifest();
          // Tell the browser to do a full reload so the fetch picks up the new manifest
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      server.watcher.on('change', refresh);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3001,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://34.14.153.43:6001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [react(), researchManifestPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});

