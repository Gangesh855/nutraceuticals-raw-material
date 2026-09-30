import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (no ISR/revalidation), so the prerendered pages are served
// straight from the static assets bundle — no KV/R2 bucket required.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
