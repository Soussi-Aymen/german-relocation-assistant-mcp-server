
# Berlin Relocation Assistant MCP Server

**Project Name:** Berlin Relocation Assistant MCP Server  
**Hackathon:** *MCP Hackathon - build AI-first products and services*

An AI-first Model Context Protocol (MCP) server providing real-time relocation assistance and legal rights automation for expats in Berlin.  
Built for the 2026 administrative landscape using Gemini 3 reasoning with Google Search grounding.

## Technical Summary
This server implements the Model Context Protocol (MCP) to expose specialized tools for the Berlin administrative ecosystem. All logic is contained in `index.tsx`.

## Tools Included
1. **`generate_schufa_free_request`**: Drafts legally sound GDPR Art. 15 requests.
2. **`check_wbs_eligibility_berlin`**: Analyzes household eligibility for subsidized housing.
3. **`get_anmeldung_guide_berlin`**: Provides up-to-the-minute registration guides.

## Running with Docker (Recommended)

### 1. Build the image
```bash
docker build -t german-relocation-mcp-server .
```

### 2. Run the container
```bash
docker run -i -e API_KEY="YOUR_GEMINI_API_KEY" german-relocation-mcp-server
```

## Local Development
1. Install dependencies: `npm install`
2. Run locally: `npm start`
