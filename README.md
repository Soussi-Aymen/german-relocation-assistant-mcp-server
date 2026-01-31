# German Relocation Assistant MCP Server

**Project Name:** German Relocation Assistant MCP Server  
**Hackathon:** *MCP Hackathon - build AI-first products and services*

An AI-first Model Context Protocol (MCP) server providing real-time relocation assistance and legal rights automation for expats in Germany.  
Built for the 2026 administrative landscape using Gemini 3 reasoning with Google Search grounding.

## Technical Summary
This server implements the Model Context Protocol (MCP) to expose specialized tools for the Berlin administrative ecosystem. All logic is consolidated in `index.ts`.

## Tools Included
1. **`generate_schufa_free_request`**: Drafts legally sound GDPR Art. 15 requests.
2. **`check_wbs_eligibility_berlin`**: Analyzes household eligibility for subsidized housing.
3. **`get_anmeldung_guide_berlin`**: Provides up-to-the-minute registration guides.

## Example Prompts
You can test the server by asking Claude the following:

* **WBS Test:** `"I live in Berlin with my wife and 1 child. We earn 35,000€ net per year. Check if we can get a WBS."`
* **Schufa Test:** `"I need to request my free Schufa data copy. My name is [Name], living at [Address], born on [Date] in [City]. Generate the letter for me."`
* **Anmeldung Test:** `"How do I do the Anmeldung in Berlin in 2026? Are there digital options?"`

---

## Running with Docker (Recommended)

### 1. Build the image
```bash
docker build -t german-relocation-mcp-server .
