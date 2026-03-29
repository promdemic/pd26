declare module "*.jpeg" {
  const path: string;
  export default path;
}

declare module "*.webp" {
  const path: string;
  export default path;
}

declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  const path: string;
  export default path;
}

declare namespace NodeJS {
  interface ProcessEnv {
    BUN_PUBLIC_FIREBASE_API_KEY: string;
    BUN_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    BUN_PUBLIC_FIREBASE_PROJECT_ID: string;
    BUN_PUBLIC_FIREBASE_APP_ID: string;
  }
}
