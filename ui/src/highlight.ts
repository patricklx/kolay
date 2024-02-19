import { modifier } from 'ember-modifier';

// import type { DOMPurifyI } from 'dompurify';
import type { HLJSApi } from 'highlight.js';

let HIGHLIGHT: HLJSApi;

export async function getHighlighter(): Promise<HLJSApi> {
  if (HIGHLIGHT) return HIGHLIGHT;

  /**
   * highlight.js is 282kb in total,
   * since we now use hljs on initial page load, eagerly, we want to load
   * as little as possible
   */
  let [hljs, glimmer, javascript, typescript, markdown, css, bash, diff] = await Promise.all([
    import('highlight.js/lib/core'),
    import('highlightjs-glimmer'),
    import('highlight.js/lib/languages/javascript'),
    import('highlight.js/lib/languages/typescript'),
    import('highlight.js/lib/languages/markdown'),
    import('highlight.js/lib/languages/css'),
    import('highlight.js/lib/languages/bash'),
    import('highlight.js/lib/languages/diff'),
  ]);

  HIGHLIGHT = hljs.default;
  HIGHLIGHT.registerLanguage('javascript', javascript.default);
  HIGHLIGHT.registerLanguage('typescript', typescript.default);
  HIGHLIGHT.registerLanguage('markdown', markdown.default);
  HIGHLIGHT.registerLanguage('css', css.default);
  HIGHLIGHT.registerLanguage('bash', bash.default);
  HIGHLIGHT.registerLanguage('diff', diff.default);

  glimmer.setup(HIGHLIGHT);

  HIGHLIGHT.registerAliases('gjs', { languageName: 'glimmer-javascript' });
  HIGHLIGHT.registerAliases('gts', { languageName: 'glimmer-javascript' });
  HIGHLIGHT.registerAliases('glimdown', { languageName: 'markdown' });

  return HIGHLIGHT;
}

export const highlight = modifier((element: HTMLElement, [_]: unknown[]) => {
  if (!_) {
    console.warn(`No argument was passed to {{highlight-code-blocks}}. Updates won't be detected`);
  }

  (async () => {
    let elements = element.querySelectorAll('pre > code');

    for (let element of elements) {
      let hljs = await getHighlighter();

      hljs.highlightElement(element as HTMLElement);

      // scrollable elements must be focusable
      element.closest('pre')?.setAttribute('tabindex', '0');
      element.setAttribute('tabindex', '0');
    }
  })();
});
