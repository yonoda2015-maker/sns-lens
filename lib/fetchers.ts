import { YoutubeTranscript } from "youtube-transcript";

export async function fetchYouTubeContent(url: string): Promise<{ text: string; metadata: Record<string, string> }> {
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch) throw new Error("YouTube動画IDを取得できませんでした");
  const videoId = videoIdMatch[1];

  const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: "ja" })
    .catch(() => YoutubeTranscript.fetchTranscript(videoId));

  const text = transcript.map((t) => t.text).join(" ");
  if (!text) throw new Error("字幕が取得できませんでした（字幕なし動画の可能性があります）");

  return {
    text,
    metadata: { "動画ID": videoId, "字幕数": `${transcript.length}件` },
  };
}

// ── X/Twitter: fxtwitter API（APIキー不要、非公式ミラー）───────────────
export async function fetchTwitterContent(url: string): Promise<{ text: string; metadata: Record<string, string> }> {
  const tweetIdMatch = url.match(/status\/(\d+)/);
  if (!tweetIdMatch) {
    const userMatch = url.match(/(?:twitter|x)\.com\/([^/?]+)/);
    const username = userMatch ? userMatch[1] : "unknown";
    return {
      text: `Twitter/X アカウント @${username} のページです。個別ツイートのURLを入力すると内容を取得できます。`,
      metadata: { アカウント: `@${username}` },
    };
  }

  const tweetId = tweetIdMatch[1];
  // ユーザー名をURLから抽出
  const userMatch = url.match(/(?:twitter|x)\.com\/([^/?]+)\/status/);
  const username = userMatch ? userMatch[1] : "i";

  // fxtwitter API（APIキー不要、公開ツイートのみ）
  const apiUrl = `https://api.fxtwitter.com/${username}/status/${tweetId}`;
  const res = await fetch(apiUrl, {
    headers: { "User-Agent": "SNSLens/1.0" },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Xのツイート取得に失敗しました (${res.status})。公開ツイートのURLか確認してください。`);

  const data = await res.json();
  if (data.code !== 200 || !data.tweet) {
    throw new Error("ツイートが見つかりませんでした。削除済みか非公開の可能性があります。");
  }

  const tweet = data.tweet;
  const author = tweet.author || {};
  let fullText = `投稿者: ${author.name || ""} (@${author.screen_name || ""})\n\n${tweet.text || ""}`;

  if (tweet.quote?.text) {
    fullText += `\n\n[引用元] @${tweet.quote.author?.screen_name}: ${tweet.quote.text}`;
  }
  if (tweet.replying_to) {
    fullText += `\n\n[返信先] @${tweet.replying_to}`;
  }

  const metadata: Record<string, string> = {
    投稿者: `@${author.screen_name || username}`,
  };
  if (tweet.likes) metadata["いいね"] = String(tweet.likes);
  if (tweet.retweets) metadata["リツイート"] = String(tweet.retweets);
  if (tweet.replies) metadata["返信"] = String(tweet.replies);

  return { text: fullText, metadata };
}

// ── Instagram: 複数方法でフォールバック（APIキー不要）──────────────────
export async function fetchInstagramContent(url: string): Promise<{ text: string; metadata: Record<string, string> }> {
  // 方法1: Instagram oEmbed（公式、基本情報のみ）
  try {
    const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&omitscript=true`;
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const text = `投稿者: ${data.author_name || ""}\n\n${data.title || ""}`;
      return { text, metadata: { 投稿者: data.author_name || "" } };
    }
  } catch { /* フォールバックへ */ }

  // Instagramはサーバーサイドからのアクセスを2024年以降制限
  const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
  const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
  const userMatch = url.match(/instagram\.com\/(?!p\/|reel\/)([^/?]+)/);
  const postId = postMatch?.[1] || reelMatch?.[1] || "";
  const username = userMatch?.[1] || "";

  const label = username ? `@${username}` : postId ? `投稿ID: ${postId}` : "Instagram";
  return {
    text: `${label}\n\nInstagramは2024年以降、サーバーサイドからのアクセスをログイン必須にしています。現在この投稿の詳細データは自動取得できません。\n\nYouTubeやX(Twitter)のURLをお試しください。`,
    metadata: { ...(username ? { アカウント: `@${username}` } : {}), ...(postId ? { 投稿ID: postId } : {}), 状態: "取得制限あり" },
  };
}

// ── TikTok: 現在サーバーサイドからの取得は不可 ──────────────────────────
export async function fetchTikTokContent(url: string): Promise<{ text: string; metadata: Record<string, string> }> {
  const videoIdMatch = url.match(/video\/(\d+)/);
  const userMatch = url.match(/tiktok\.com\/@([^/?]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : "不明";
  const username = userMatch ? userMatch[1] : "不明";

  return {
    text: `TikTok動画 @${username} (ID: ${videoId})\n\nTikTokは2024年以降、サーバーサイドからのアクセスをブロックしています。現在この動画の詳細データは自動取得できません。\n\n動画の内容を手動でテキスト入力いただくか、YouTubeやX(Twitter)のURLをお試しください。`,
    metadata: { 投稿者: `@${username}`, "動画ID": videoId, 状態: "取得制限あり" },
  };
}

// ── 汎用Webスクレイピング ──────────────────────────────────────────────────
export async function fetchWebContent(url: string): Promise<{ text: string; metadata: Record<string, string> }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`ページの取得に失敗しました (${res.status})`);
  const html = await res.text();

  const { load } = await import("cheerio");
  const $ = load(html);
  $("script, style, nav, footer, header, aside, iframe, noscript").remove();

  const title = $("title").text().trim() || $("h1").first().text().trim();
  const text = $("article, main, .content, #content, body")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);

  return {
    text: text || "コンテンツの抽出に失敗しました",
    metadata: title ? { タイトル: title } : {},
  };
}
