
import { defineConfig, exports, type CloudflareConfig } from "cf/config";

export default defineConfig(({ mode }) => {
  // Named deployment modes must be configured explicitly.
  if (mode !== undefined && mode !== "develop") {
    throw new Error(`Unknown deployment mode: ${mode}`);
  }

  return {
    worker: {
      name: mode === "develop" ? "llm-proxy-develop" : "llm-proxy",

      compatibilityDate: "2026-07-27",

      compatibilityFlags: [
        "nodejs_compat",
        "enable_request_signal",
      ],

      entrypoint: "src/index.ts",

      exports: {
        KeyRotationManager: exports.durableObject({
          state: "deleted",
        }),
      },

      placement: {
        mode: "smart",
      },

      observability: {
        enabled: true,

        logs: {
          enabled: true,
          headSamplingRate: 1,
          invocationLogs: true,
        },

        traces: {
          enabled: true,
          headSamplingRate: 0.05,
        },
      },
    },
  } satisfies CloudflareConfig;
});
