'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => viteRuntimeErrorOverlayPlugin,
});
module.exports = __toCommonJS(src_exports);
var import_node_fs = require('fs');
var import_trace_mapping = require('@jridgewell/trace-mapping');
var packageName = 'runtime-error-plugin';
function viteRuntimeErrorOverlayPlugin(options) {
  return {
    name: packageName,
    apply(config, env) {
      return env.command === 'serve' && !config.ssr;
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: CLIENT_SCRIPT,
        },
      ];
    },
    configureServer(server) {
      server.ws.on(MESSAGE_TYPE, (data, client) => {
        const error = Object.assign(new Error(), data);
        if (!error.stack) {
          return;
        }
        if (options?.filter && !options.filter(error)) {
          return;
        }
        const { stack, loc } = rewriteStacktrace(
          error.stack,
          server.moduleGraph,
        );
        const err = {
          name: error.name,
          message: error.message,
          stack,
          loc,
          plugin: packageName,
        };
        if (loc?.file) {
          err.id = loc?.file;
          const source = (0, import_node_fs.readFileSync)(loc.file, 'utf-8');
          err.frame = generateCodeFrame(source, {
            line: loc.line,
            column: loc.column - 1,
          });
        }
        client.send({
          type: 'error',
          err,
        });
      });
    },
  };
}
var MESSAGE_TYPE = `${packageName}:error`;
var CLIENT_SCRIPT = `
import { createHotContext } from "/@vite/client";
const hot = createHotContext("/__dummy__${packageName}");

function sendError(error) {
  if (!(error instanceof Error)) {
    error = new Error("(unknown runtime error)");
  }
  const serialized = {
    message: error.message,
    stack: error.stack,
  };
  hot.send("${MESSAGE_TYPE}", serialized);
}

window.addEventListener("error", (evt) => {
  sendError(evt.error);
});

window.addEventListener("unhandledrejection", (evt) => {
  sendError(evt.reason);
});
`;
function cleanStack(stack) {
  return stack
    .split(/\n/g)
    .filter((l) => /^\s*at/.test(l))
    .join('\n');
}
function rewriteStacktrace(stack, moduleGraph) {
  let loc = void 0;
  const rewrittenStack = cleanStack(stack)
    .split('\n')
    .map((line) => {
      return line.replace(
        /^ {4}at (?:(\S+?) )?\(?(?:https|http):\/\/[^\/]+(\/[^\s?]+).*:(\d+):(\d+)\)?$/,
        (input, varName, url, line2, column) => {
          if (!url) {
            return input;
          }
          const module2 = moduleGraph.urlToModuleMap.get(url);
          if (!module2) {
            return '';
          }
          const rawSourceMap = module2?.transformResult?.map;
          if (rawSourceMap) {
            const traced = new import_trace_mapping.TraceMap(rawSourceMap);
            const pos = (0, import_trace_mapping.originalPositionFor)(traced, {
              line: Number(line2),
              // stacktrace's column is 1-indexed, but sourcemap's one is 0-indexed
              column: Number(column) - 1,
            });
            if (pos.source && pos.line >= 0 && pos.column >= 0) {
              line2 = pos.line;
              column = pos.column + 1;
            }
          }
          const trimmedVarName = varName?.trim();
          const sourceFile = module2.file;
          const source = `${module2.file}:${line2}:${column}`;
          if (sourceFile) {
            loc ??= {
              line: Number(line2),
              column: Number(column),
              file: sourceFile,
            };
          }
          if (!trimmedVarName || trimmedVarName === 'eval') {
            return `    at ${source}`;
          } else {
            return `    at ${trimmedVarName} ${source}`;
          }
        },
      );
    })
    .join('\n');
  return {
    stack: rewrittenStack,
    loc,
  };
}
var splitRE = /\r?\n/g;
var range = 2;
function posToNumber(source, pos) {
  if (typeof pos === 'number') {
    return pos;
  }
  const lines = source.split(splitRE);
  const { line, column } = pos;
  let start = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1;
  }
  return start + column;
}
function generateCodeFrame(source, start = 0, end) {
  start = Math.max(posToNumber(source, start), 0);
  end = Math.min(
    end !== void 0 ? posToNumber(source, end) : start,
    source.length,
  );
  const lines = source.split(splitRE);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) {
          continue;
        }
        const line = j + 1;
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`,
        );
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = Math.max(start - (count - lineLength), 0);
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start,
          );
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + '^'.repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
    count++;
  }
  return res.join('\n');
}
//# sourceMappingURL=index.js.map
