import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { detectPlatform } from "@/lib/detectPlatform";
import {
  fetchYouTubeContent,
  fetchTwitterContent,
  fetchInstagramContent,
  fetchTikTokContent,
  fetchWebContent,
} from "@/lib/fetchers";
import { buildPrompt } from "@/lib/prompts";
import type { AnalysisMode } from "@/app/page";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { url, mode }: { url: string; mode: AnalysisMode } = await req.json();

    if (!url?.trim()) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }

    const platform = detectPlatform(url);
    let content = "";
    let metadata: Record<string, string> = {};

    if (platform === "youtube") {
      const fetched = await fetchYouTubeContent(url);
      content = fetched.text;
      metadata = fetched.metadata;
    } else if (platform === "twitter") {
      const fetched = await fetchTwitterContent(url);
      content = fetched.text;
      metadata = fetched.metadata;
    } else if (platform === "instagram") {
      const fetched = await fetchInstagramContent(url);
      content = fetched.text;
      metadata = fetched.metadata;
    } else if (platform === "tiktok") {
      const fetched = await fetchTikTokContent(url);
      content = fetched.text;
      metadata = fetched.metadata;
    } else {
      const fetched = await fetchWebContent(url);
      content = fetched.text;
      metadata = fetched.metadata;
    }

    const prompt = buildPrompt(mode, platform, content, url);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let infographic = null;
    if (jsonMatch) {
      try {
        infographic = JSON.parse(jsonMatch[0]);
      } catch { /* rawをフォールバック */ }
    }

    return NextResponse.json({ platform, mode, url, raw, infographic, metadata });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
