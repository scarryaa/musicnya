exports.default = function (context) {
  // Skip if not mac or windows
  if (process.platform !== "darwin" && process.platform !== "win32") return;

  // VMP sign via EVS
  const { execSync } = require("child_process");
  console.log("VMP signing start");

  // Load EVS credentials from environment variables
  const username = process.env.EVS_USERNAME;
  const password = process.env.EVS_PASSWORD;

  if (!username || !password) {
    console.log("EVS credentials are missing");
    return;
  }

  const command =
    process.platform === "darwin"
      ? `EVS_USERNAME="${username}" EVS_PASSWORD="${password}" python3 -m castlabs_evs.vmp sign-pkg ./dist/mac ${context.appOutDir}`
      : `EVS_USERNAME="${username}" EVS_PASSWORD="${password}" python -m castlabs_evs.vmp sign-pkg ./dist/win-unpacked ${context.appOutDir}`;

  execSync(command);
  console.log("VMP signing complete");
};
