
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

/**
 * PROJECT: Berlin Relocation Assistant MCP Server
 * EVENT: MCP Hackathon - build AI-first products and services
 * YEAR: 2026 Edition
 * 
 * Logic consolidated in index.tsx for source simplicity.
 * Note: This code is intended to be run in a Node.js environment via Docker or CLI.
 */

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Initialize MCP Server
const server = new McpServer({
  name: "berlin-relocation-assistant",
  version: "1.0.0",
});

// --- TOOLS ---

/**
 * Tool 1: generate_schufa_free_request
 * Purpose: Generates a formal legal letter for a free GDPR Art. 15 data copy.
 */
server.tool(
  "generate_schufa_free_request",
  {
    name: z.string().describe("Legal name of the requester"),
    address: z.string().describe("Current address in Germany"),
    birthDate: z.string().describe("Date of birth (YYYY-MM-DD)"),
    birthPlace: z.string().describe("Place of birth"),
  },
  async ({ name, address, birthDate, birthPlace }) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a formal and professional GDPR Article 15 "Datenkopie" (Data Copy) request in German to:
        SCHUFA Holding AG, Kormoranweg 5, 65201 Wiesbaden, Germany.
        
        Requester Information:
        Name: ${name}
        Address: ${address}
        Date of Birth: ${birthDate}
        Place of Birth: ${birthPlace}
        
        Context: Year is 2026. The requester knows about the simplified online basic score but insists on the full, legally-mandated free data copy for complete transparency.`,
    });

    return {
      content: [{ type: "text", text: response.text || "Letter generation failed." }],
    };
  }
);

/**
 * Tool 2: check_wbs_eligibility_berlin
 * Purpose: Calculate eligibility for subsidized housing using Berlin's 2026 income brackets.
 */
server.tool(
  "check_wbs_eligibility_berlin",
  {
    householdSize: z.number().int().positive().describe("Number of people in the household"),
    annualNetIncome: z.number().nonnegative().describe("Total annual net income (EUR)"),
    numberOfChildren: z.number().int().nonnegative().describe("Number of minor children"),
  },
  async ({ householdSize, annualNetIncome, numberOfChildren }) => {
    // 2026 Berlin WBS 140 Logic (Standard)
    const base140 = householdSize === 1 ? 16800 : 25200;
    const extraAdults = Math.max(0, householdSize - (householdSize === 1 ? 1 : 2));
    const limit140 = base140 + (extraAdults * 5740) + (numberOfChildren * 700);
    
    // 2026 WBS 180 (Middle Income) - approx 60% higher than WBS 140
    const limit180 = limit140 * 1.6;

    let status = "Not Eligible";
    let qualification = "None";

    if (annualNetIncome <= limit140) {
      status = "Likely Eligible";
      qualification = "WBS 140 (Standard Subsidized Housing)";
    } else if (annualNetIncome <= limit180) {
      status = "Likely Eligible";
      qualification = "WBS 180 (Middle-Income Bracket)";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze Berlin WBS housing eligibility for a household in 2026.
        Inputs: Household Size: ${householdSize}, Income: €${annualNetIncome}, Result: ${status} (${qualification}).
        Explain results in Markdown. Mention next steps for the Wohnungsamt.`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return {
      content: [{ type: "text", text: response.text || "Analysis failed." }],
    };
  }
);

/**
 * Tool 3: get_anmeldung_guide_berlin
 * Purpose: Final step of relocation—registration.
 */
server.tool(
  "get_anmeldung_guide_berlin",
  {},
  async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Guide for 'Anmeldung' in Berlin for 2026. Include digital options (BundID/eID), the booking link https://service.berlin.de/dienstleistung/120686/, and tips for finding appointments.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text || "Guide not available.";
    
    // Extract grounding URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      text += "\n\n### Official Sources (2026):\n";
      const uniqueUris = new Set();
      chunks.forEach((chunk: any) => {
        if (chunk.web && !uniqueUris.has(chunk.web.uri)) {
          uniqueUris.add(chunk.web.uri);
          text += `- [${chunk.web.title || "Berlin.de"}](${chunk.web.uri})\n`;
        }
      });
    }

    return {
      content: [{ type: "text", text }],
    };
  }
);

// --- START SERVER ---

async function main() {
  // Guard for browser environments to prevent errors during build/preview
  if (typeof window !== "undefined") {
    console.warn("Berlin Relocation Assistant: MCP Server logic is inactive in the browser. Run via CLI/Docker for full functionality.");
    return;
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Berlin Relocation Assistant MCP Server running on stdio");
}

main().catch((error) => {
  if (typeof window === "undefined") {
    console.error("Fatal error:", error);
    process.exit(1);
  }
});
