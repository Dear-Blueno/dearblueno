// Node 24 can require ky's ESM entrypoint. Jest 29 needs its syntax transformed.
const ts = require("typescript");
module.exports = {
  process(source, filename) {
    return {
      code: ts.transpileModule(source, {
        fileName: filename,
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    };
  },
};
