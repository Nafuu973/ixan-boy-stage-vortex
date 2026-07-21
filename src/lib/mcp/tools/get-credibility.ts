import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dict } from "../../i18n";

export default defineTool({
  name: "get_credibility",
  title: "Get credibility signals",
  description:
    "Returns IXAN BOY's public credibility signals: labels, artists who play his tracks, and why-book pitch cards.",
  inputSchema: {
    lang: z.enum(["fr", "en"]).default("fr").describe("Response language."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const d = dict[lang];
    const info = {
      pitch: d.why.cards,
      booking_highlights: d.booking.cards,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
