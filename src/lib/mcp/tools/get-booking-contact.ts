import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dict } from "../../i18n";

export default defineTool({
  name: "get_booking_contact",
  title: "Get booking contact",
  description:
    "Returns the official booking contact information for IXAN BOY (email and call-to-action text).",
  inputSchema: {
    lang: z.enum(["fr", "en"]).default("fr").describe("Response language."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const c = dict[lang].contact;
    const info = { email: c.mail, cta: c.cta, headline: c.headline.join(" ") };
    return {
      content: [
        { type: "text", text: `Booking: ${info.email}` },
      ],
      structuredContent: info,
    };
  },
});
