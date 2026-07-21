import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dict } from "../../i18n";

export default defineTool({
  name: "get_artist_info",
  title: "Get artist info",
  description:
    "Returns the IXAN BOY artist presentation: genre, tagline, intro, and full biography. Choose language 'fr' or 'en'.",
  inputSchema: {
    lang: z
      .enum(["fr", "en"])
      .default("fr")
      .describe("Response language: 'fr' (French) or 'en' (English)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const d = dict[lang];
    const info = {
      name: "IXAN BOY",
      genre: d.hero.sub,
      tagline: d.hero.tag,
      intro: d.hero.intro,
      presentation: {
        title: d.presentation.title,
        paragraphs: d.presentation.paragraphs,
      },
      dna: {
        title: d.dna.title,
        intro: d.dna.intro,
        body: d.dna.body,
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
