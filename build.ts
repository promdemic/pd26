import tailwind from "bun-plugin-tailwind";
import { REQUIRED_FIREBASE_ENV } from "./src/lib/firebaseEnv";

const missing = REQUIRED_FIREBASE_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(
    "Missing required environment variables:\n" +
      missing.map((k) => `  ${k}`).join("\n"),
  );
  process.exit(1);
}

const result = await Bun.build({
  plugins: [tailwind],
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  target: "browser",
  sourcemap: "external",
  minify: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  env: "BUN_PUBLIC_*",
});

if (!result.success) {
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}
