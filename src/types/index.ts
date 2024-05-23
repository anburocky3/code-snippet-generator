export interface VSCodeSnippet {
  prefix: string;
  body: string[];
  description: string;
}

export interface FrontMatterAttributes {
  attributes: {
    prefix: string;
    description: string;
  };
  body: string;
  bodyBegin: number;
  frontmatter: string;
}
