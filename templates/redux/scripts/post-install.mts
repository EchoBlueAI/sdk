import { lilconfig, type Options } from "lilconfig";
import { readFile, writeFile } from "fs/promises";

type ConfigType = {
  api?: {
    url?: string;
  };
};

const options = {
  searchPlaces: [
    ".echobluerc.json",
    ".echobluerc",
    "echoblue.config.json",
    "echoblue.json",
    "echobluerc.json",
  ],
} satisfies Options;

const fetcher = lilconfig("echobluerc", options);
const result = await fetcher.search();

if (!result?.config) {
  console.warn(
    "No .echobluerc.json config file found, please create one to configure the Redux API.\n" +
      "NOTE: By not supplying an api.url in .echobluerc.json you will not be able to connect to the EchoBlueAI APIs.",
  );
}

const config = result?.config as ConfigType;

try {
  const cjs = await readFile("./dist/cjs/index.js", "utf-8");
  const esm = await readFile("./dist/esm/index.js", "utf-8");

  // Simplified regex to match the baseUrl line
  const baseUrlRegex = /(baseUrl: )("[^"]*")/;

  // For the ESM version
  const patchedESM = esm.replace(baseUrlRegex, `$1"${config.api?.url ?? "/"}"`);

  // For the CJS version
  const patchedCJS = cjs.replace(baseUrlRegex, `$1"${config.api?.url ?? "/"}"`);

  console.log({ patchedCJS });

  await writeFile("./dist/cjs/index.js", patchedCJS);
  await writeFile("./dist/esm/index.js", patchedESM);

  console.log(
    "Redux API URL has been patched with the value from .echobluerc.json",
  );
} catch (error) {
  console.error("Failed to patch Redux API URL", error);
}
