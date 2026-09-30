// Safety net for Cloudflare Workers Builds.
//
// Workers Builds injects WORKERS_CI=1. If the dashboard's "Build command" is left empty, the default
// deploy command (`npx wrangler deploy`) runs against an unbuilt project and fails with
// "Could not find compiled Open Next config, did you run the build command?".
// To make the default settings work, build the OpenNext bundle at the end of `npm ci`.
//
// Opt out (e.g. if you set Build command to `npx opennextjs-cloudflare build` yourself) by adding the
// build variable SKIP_CF_INSTALL_BUILD=1. Does nothing outside Workers Builds.
import { spawnSync } from "node:child_process";

if (process.env.WORKERS_CI !== "1" || process.env.SKIP_CF_INSTALL_BUILD) process.exit(0);

console.log("[cf-ci-build] Workers Builds detected: building with OpenNext during install");
const r = spawnSync("npx", ["opennextjs-cloudflare", "build"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
