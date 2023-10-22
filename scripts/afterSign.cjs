exports.default = function (context) {
  // Skip if not windows
  if (process.platform !== "win32") return;

  // VMP sign via EVS
  const { execSync } = require("child_process");
  console.log("VMP signing start");

  const command =
    "python -m castlabs_evs.vmp sign-pkg ./dist/win-unpacked " +
    context.appOutDir;

  execSync(command);
  console.log("VMP signing complete");
};
