export interface FindReplaceRule {
  id: string;
  find: string;
  replace: string;
}

export interface ProcessingOptions {
  rules: FindReplaceRule[];
}

export type SubtitleFormat = 'TXT' | 'SRT';