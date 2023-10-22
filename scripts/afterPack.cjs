exports.default = function (context) {
  // Skip if not mac or windows
  if (process.platform !== "darwin" && process.platform !== "win32") return;

  // VMP sign via EVS
  const { execSync } = require("child_process");
  console.log("VMP signing start");

  const command =
    process.platform === "darwin"
      ? "python3 -m castlabs_evs.vmp sign-pkg ./dist/mac " + context.appOutDir
      : "python -m castlabs_evs.vmp sign-pkg ./dist/win-unpacked " +
        context.appOutDir;

  execSync(command);
  console.log("VMP signing complete");
};
