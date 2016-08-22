var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm",
  main: "job-tracker/main"
}, {
  bundleAssets: true,
  minify: false
});
