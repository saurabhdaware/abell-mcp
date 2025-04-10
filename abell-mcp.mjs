import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import create from "create-abell";

// Create an MCP server
const server = new McpServer({
  name: "Abell MCP",
  version: "1.0.0",
});

// Add an addition tool
server.tool("get_abell_syntax", {}, async () => {
  const syntaxGuide = await fetch("https://abelljs.org/ai/llms.txt").then(
    (res) => res.text()
  );
  return {
    content: [{ type: "text", text: syntaxGuide }],
  };
});

server.tool(
  "scaffold_abell_app",
  {
    projectName: z.string(),
    installer: z.enum(["npm", "pnpm", "yarn"]),
    template: z.string(),
  },
  async ({ projectName, installer = "npm", template = "default" }) => {
    const app = await create(projectName, {
      installer,
      template,
    });
    return { content: [{ type: "text", text: app }] };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
