import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";

// Create an MCP server
const server = new McpServer({
  name: "Abell MCP",
  version: "1.0.0",
});

// Add an addition tool
server.tool(
  "get_abell_syntax",
  "This is to help understand the syntax of Abell and get basic understanding of abell",
  {},
  async () => {
    const syntaxGuide = await fetch("https://abelljs.org/ai/llms.txt").then(
      (res) => res.text()
    );
    return {
      content: [{ type: "text", text: syntaxGuide }],
    };
  }
);

server.tool(
  "scaffold_abell_app",
  "This scaffolds a full fledge abell application. Note: Before calling tool, ensure you're in current working directory, ensure the directory is empty. Use `.` as projectName when not explicitly mentioned",
  {
    projectName: z.string(),
    cwd: z.string(),
  },
  async ({ projectName = ".", cwd }) => {
    execSync(
      `npx create-abell@latest ${projectName} --installer skip --template default`,
      { stdio: "inherit", cwd }
    );
    return {
      content: [
        {
          type: "text",
          text: `Scaffolded ${projectName}`,
        },
      ],
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
