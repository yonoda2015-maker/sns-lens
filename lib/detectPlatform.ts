import type { Platform } from "@/app/page";

export function detectPlatform(url: string): Platform {
  if (/twitter\.com|x\.com/.test(url)) return "twitter";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  return "unknown";
}
