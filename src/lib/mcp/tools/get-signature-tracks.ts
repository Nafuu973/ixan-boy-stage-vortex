import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dict } from "../../i18n";

export default defineTool({
  name: "get_signature_tracks",
  title: "Get signature tracks",
  description: "Returns IXAN BOY's signature tracks with title and mood description.",
  inputSchema: {
    lang: z.enum(["fr", "en"]).default("fr").describe("Response language."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const tracks = dict[lang].tracks.list;
    return {
      content: [{ type: "text", text: JSON.stringify(tracks, null, 2) }],
      structuredContent: { tracks },
    };
  },
});
