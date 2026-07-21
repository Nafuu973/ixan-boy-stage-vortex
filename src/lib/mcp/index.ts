import { defineMcp } from "@lovable.dev/mcp-js";
import getArtistInfo from "./tools/get-artist-info";
import getSignatureTracks from "./tools/get-signature-tracks";
import getBookingContact from "./tools/get-booking-contact";
import getCredibility from "./tools/get-credibility";

export default defineMcp({
  name: "ixan-boy-epk",
  title: "IXAN BOY — EPK",
  version: "0.1.0",
  instructions:
    "Public read-only tools for the IXAN BOY electronic press kit (EPK). Use these to fetch the artist bio, signature tracks, credibility signals (labels, supporting artists) and the official booking contact. All tools support French ('fr') and English ('en').",
  tools: [getArtistInfo, getSignatureTracks, getBookingContact, getCredibility],
});
