import fm from "front-matter";
import { promises as fs } from "fs";
import path from "path";
import { FrontMatterAttributes } from "./types";
import { parseVSCode } from "./helpers/convert";
import chalk from "chalk";

let TEMPLATE_DIR = "../templates/react-ts/";
let OUTPUT_DIR = "../snippets/";

// CLI arguments
var args = process.argv.slice(2);
const ARG_TEMPLATE_DIR = args[0];
const ARG_OUTPUT_DIR = args[1];

if (
  ARG_TEMPLATE_DIR.split("=")[0] !== "--template" ||
  ARG_OUTPUT_DIR.split("=")[0] !== "--output"
) {
  console.log("Error: \t Please provide the correct arguments");
  process.exit(1);
}

if (ARG_TEMPLATE_DIR && ARG_OUTPUT_DIR) {
  TEMPLATE_DIR = ARG_TEMPLATE_DIR.split("=")[1];
  OUTPUT_DIR = ARG_OUTPUT_DIR.split("=")[1];
}

let emptyObj = {} as any;

(async () => {
  const files = await fs.readdir(path.join(__dirname, TEMPLATE_DIR));

  let fileCounts = 0;

  // Promise.all get an array of Promises
  await Promise.all(
    // each async function returns a Promise, so we map our files to a Promise

    files.map(async (file) => {
      await fs
        .readFile(path.join(__dirname, TEMPLATE_DIR + file), "utf8")
        .then((data) => {
          let content = fm(data) as FrontMatterAttributes;

          const regexCodeBlock = /```js\r\n(.*?)```/gs;
          const matches = [...content.body.matchAll(regexCodeBlock)];
          const codeBlocks = matches.map((match) => match[1]);

          const prefix = content.attributes.prefix;
          const description = content.attributes.description;

          const result = parseVSCode(description, prefix, codeBlocks[0]);

          Object.assign(emptyObj, { [description]: result });

          return emptyObj;
        });

      fileCounts++;
    })
  );

  // write the final JSON object to the file
  await fs.writeFile(
    path.join(__dirname, OUTPUT_DIR + "snippets.code-snippets"),
    JSON.stringify(emptyObj, null, 2)
  );

  console.log(`
  -------------------------------------
  - ${chalk.blue("Files processed:")} ${fileCounts}

  - ${chalk.greenBright("Message:")} File written succesfully!
  -------------------------------------
  `);
})();
