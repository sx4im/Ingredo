// src/cartographer.ts
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "@babel/parser";
import MagicString from "magic-string";

// src/constants.ts
var DATA_ATTRIBUTES = {
  METADATA: "data-replit-metadata",
  COMPONENT_NAME: "data-component-name"
};

// src/cartographer.ts
var validExtensions = /* @__PURE__ */ new Set([".jsx", ".tsx"]);
function cartographer() {
  let clientScript;
  let configuredRoot;
  let configuredRootName;
  return {
    name: "@replit/vite-plugin-cartographer",
    enforce: "pre",
    async configResolved(config) {
      configuredRoot = config.root;
      configuredRootName = path.basename(configuredRoot);
      const currentFileUrl = typeof __dirname === "string" ? path.join(__dirname, "../dist/beacon/index.global.js") : fileURLToPath(
        new URL("../dist/beacon/index.global.js", import.meta.url)
      );
      try {
        clientScript = await fs.readFile(currentFileUrl, "utf-8");
      } catch (error) {
        console.error(
          "[replit-cartographer] Failed to load client script:",
          error
        );
      }
    },
    resolveId(_source, _importer) {
      return null;
    },
    async transform(code, id) {
      if (!validExtensions.has(path.extname(id)) || id.includes("node_modules")) {
        return null;
      }
      try {
        const ast = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"]
        });
        const magicString = new MagicString(code);
        let currentElement = null;
        const traverse = await import("@babel/traverse").then((m) => m.default);
        traverse(ast, {
          JSXElement: {
            enter(elementPath) {
              currentElement = elementPath.node;
            },
            exit() {
              currentElement = null;
            }
          },
          JSXOpeningElement(elementPath) {
            if (currentElement) {
              const jsxNode = elementPath.node;
              const elementName = getElementName(jsxNode);
              if (!elementName) {
                return;
              }
              const { line = 0, column: col = 0 } = jsxNode.loc?.start ?? {};
              const relativeToConfigured = path.relative(configuredRoot, id);
              const componentPath = path.join(
                configuredRootName,
                relativeToConfigured
              );
              const componentMetadata = col === 0 ? `${componentPath}:${line}` : `${componentPath}:${line}:${col}`;
              magicString.appendLeft(
                jsxNode.name.end ?? 0,
                ` ${DATA_ATTRIBUTES.METADATA}="${componentMetadata}" ${DATA_ATTRIBUTES.COMPONENT_NAME}="${elementName}"`
              );
            }
          }
        });
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true })
        };
      } catch (error) {
        console.error(`[replit-cartographer] Error processing ${id}:`, error);
        return null;
      }
    },
    transformIndexHtml() {
      if (!clientScript) {
        return [];
      }
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: clientScript,
          injectTo: "head"
        }
      ];
    }
  };
}
function getElementName(jsxNode) {
  if (jsxNode.name.type === "JSXIdentifier") {
    return jsxNode.name.name;
  }
  if (jsxNode.name.type === "JSXMemberExpression") {
    const memberExpr = jsxNode.name;
    const object = memberExpr.object;
    const property = memberExpr.property;
    return `${object.name}.${property.name}`;
  }
  return null;
}

// package.json
var version = "0.3.0";
export {
  cartographer,
  version
};
//# sourceMappingURL=index.mjs.map