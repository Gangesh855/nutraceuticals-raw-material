// One-shot build: esbuild -> dist/index.js (ESM, react external), tsc -> dist/**/*.d.ts, styles -> dist/styles.css.
import { build } from "esbuild";
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
rmSync(join(root, "dist"), { recursive: true, force: true });
mkdirSync(join(root, "dist"), { recursive: true });

await build({
  entryPoints: [join(root, "src/index.ts")],
  outfile: join(root, "dist/index.js"),
  bundle: true,
  format: "esm",
  target: "es2020",
  jsx: "automatic",
  external: ["react", "react-dom", "react/jsx-runtime"],
});

const tsc = spawnSync("npx", ["tsc", "-p", join(root, "tsconfig.json")], { stdio: "inherit", cwd: root });
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

cpSync(join(root, "src/styles.css"), join(root, "dist/styles.css"));
console.log("built @gk/botanical-ui -> dist/");
