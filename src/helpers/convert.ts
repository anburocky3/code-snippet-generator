import { html } from "common-tags";

export const parseVSCode = (
  description: string,
  tabtrigger: string,
  snippet: string
) => {
  // escape " with \"
  // split lines by line-break
  const separatedSnippet = snippet
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .split("\n");

  const separatedSnippetLength = separatedSnippet.length;

  const finalSnippet = separatedSnippet.map((line, index) => {
    // console.log(line);
    const result = line.replace(/(\r\n|\n|\r)/gm, "");

    return index === separatedSnippetLength - 1 ? `${result}` : `${result}`;
  });

  const result = {
    prefix: tabtrigger,
    body: finalSnippet,
    description: description,
  };

  return result;
};

export const renderSublimeText = (
  description: string,
  tabtrigger: string,
  snippet: string
) => {
  const regexpMagic = /(\$)([a-z(]+)([^$])/gi;
  const escapedSnippet = snippet.replace(regexpMagic, "\\$1$2$3");
  // prettier-ignore
  return html`
      <snippet>
        <content><![CDATA[
      ${escapedSnippet}
      ]]></content>
        <tabTrigger>${tabtrigger}</tabTrigger>
        <description>${description}</description>
        <!-- Optional: Set a scope to limit where the snippet will trigger -->
        <!-- <scope >source.python</scope > -->
      </snippet>
    `;
};
