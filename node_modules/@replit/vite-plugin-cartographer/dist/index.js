"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/cartographer.ts
var _promises = require('fs/promises'); var _promises2 = _interopRequireDefault(_promises);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _url = require('url');
var _parser = require('@babel/parser');
var _magicstring = require('magic-string'); var _magicstring2 = _interopRequireDefault(_magicstring);

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
      configuredRootName = _path2.default.basename(configuredRoot);
      const currentFileUrl = typeof __dirname === "string" ? _path2.default.join(__dirname, "../dist/beacon/index.global.js") : _url.fileURLToPath.call(void 0, 
        new URL("../dist/beacon/index.global.js", import.meta.url)
      );
      try {
        clientScript = await _promises2.default.readFile(currentFileUrl, "utf-8");
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
      if (!validExtensions.has(_path2.default.extname(id)) || id.includes("node_modules")) {
        return null;
      }
      try {
        const ast = _parser.parse.call(void 0, code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"]
        });
        const magicString = new (0, _magicstring2.default)(code);
        let currentElement = null;
        const traverse = await Promise.resolve().then(() => _interopRequireWildcard(require("@babel/traverse"))).then((m) => m.default);
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
              const { line = 0, column: col = 0 } = _nullishCoalesce(_optionalChain([jsxNode, 'access', _ => _.loc, 'optionalAccess', _2 => _2.start]), () => ( {}));
              const relativeToConfigured = _path2.default.relative(configuredRoot, id);
              const componentPath = _path2.default.join(
                configuredRootName,
                relativeToConfigured
              );
              const componentMetadata = col === 0 ? `${componentPath}:${line}` : `${componentPath}:${line}:${col}`;
              magicString.appendLeft(
                _nullishCoalesce(jsxNode.name.end, () => ( 0)),
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



exports.cartographer = cartographer; exports.version = version;
//# sourceMappingURL=index.js.map