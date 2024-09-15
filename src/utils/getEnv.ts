export function getEnv(key: string): string {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || "";
  }
  if (typeof import.meta !== "undefined" && import.meta.env) {
    console.log(import.meta.env[key])
    return import.meta.env[key] || "";
  }
  return "";
}
