import * as HtmlToReact from 'html-to-react';

/** */
const parser = HtmlToReact.Parser();

/** */
export function htmlToReact(html: string) {
  return parser.parse(html);
}