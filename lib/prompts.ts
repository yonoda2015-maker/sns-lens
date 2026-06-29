import type { AnalysisMode, Platform } from "@/app/page";

export function buildPrompt(
  mode: AnalysisMode,
  platform: Platform,
  content: string,
  url: string
): string {
  const platformLabel = { twitter: "Twitter/X", youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", unknown: "Web" }[platform];

  const rules = `
【重要ルール】
- JSON形式のみ返す（前後の説明文・マークダウン記号は一切不要）
- headingは核心を突いた短い見出し（12文字以内）
- detailは読んだ人が理解できる具体的な一文（50〜70文字）
- tagsは「このステップで重要なキーワード・数字・固有名詞」を3〜5個の配列で返す（各タグ10文字以内）
  例：「3%手数料」「週200万人」「Gumroad」「無料登録」など具体的な値
- tagsで数字・パーセント・金額・人数が含まれる場合は必ずタグに入れる
- iconはそのステップの主題を表す絵文字1つ
- icon2はそのステップの結果・効果・ポイントを表す絵文字1つ（iconと別の絵文字）
`;

  const stepSchema = `    {
      "number": 1,
      "heading": "見出し（12文字以内）",
      "detail": "具体的な説明文（50〜70文字）",
      "tags": ["重要キーワード1", "数字や固有名詞2", "タグ3"],
      "icon": "このステップの主題を表す絵文字1つ（左側に大きく表示）",
      "icon2": "このステップの結果・効果・ポイントを表す別の絵文字1つ（右側に表示。iconと異なるもの）"
    }`;

  const modeInstructions: Record<AnalysisMode, string> = {
    summary: `以下の${platformLabel}コンテンツを徹底分析し、インフォグラフィック用JSONを返してください。
${rules}
{
  "title": "コンテンツの核心を表すキャッチーなタイトル（12文字以内）",
  "subtitle": "一言で内容を伝えるサブタイトル（30文字以内）",
  "steps": [
${stepSchema}
  ],
  "conclusion": "読者への力強い結論メッセージ（20文字以内）"
}
ステップは5〜7個。`,

    trend: `以下の${platformLabel}コンテンツのトレンドを徹底分析し、インフォグラフィック用JSONを返してください。
${rules}
{
  "title": "トレンドタイトル（12文字以内）",
  "subtitle": "なぜ今注目か（30文字以内）",
  "steps": [
${stepSchema}
  ],
  "conclusion": "これからの展望（20文字以内）"
}
上位5〜6テーマ。`,

    account: `以下の${platformLabel}コンテンツから発信者の特徴を分析し、インフォグラフィック用JSONを返してください。
${rules}
{
  "title": "アカウントの特徴タイトル（12文字以内）",
  "subtitle": "発信スタイルの核心（30文字以内）",
  "steps": [
${stepSchema}
  ],
  "conclusion": "このアカウントの一言評価（20文字以内）"
}
5〜6項目。`,

    hashtag: `以下の${platformLabel}コンテンツのハッシュタグを分析し、インフォグラフィック用JSONを返してください。
${rules}
{
  "title": "ハッシュタグ戦略タイトル（12文字以内）",
  "subtitle": "効果的な使い方（30文字以内）",
  "steps": [
${stepSchema}
  ],
  "conclusion": "タグ戦略の核心（20文字以内）"
}
5〜6カテゴリ。`,
  };

  return `URL: ${url}

${modeInstructions[mode]}

---コンテンツ---
${content.slice(0, 6000)}`;
}
