import { Shadowed } from 'ember-primitives';
import { Compiled as REPLCompiled } from 'ember-repl';
import { resource } from 'ember-resources';

import { defaultOptions } from './import-map.ts';
import { APIDocs, ComponentSignature } from './typedoc/index.ts';

type Input = string | undefined | null;
type Format = 'glimdown' | 'gjs' | 'hbs';
export interface Options {
  format?: Format;
  importMap: Record<string, Record<string, unknown>>;
  topLevelScope: Record<string, unknown>;
}

export function Compiled(
  markdownText: Input | (() => Input),
  userOptions?: Options
): ReturnType<typeof REPLCompiled> {
  return resource(({ use }) => {
    let options = {
      ShadowComponent: 'Shadowed',
      ...defaultOptions,
      ...userOptions,
      topLevelScope: {
        Shadowed,
        APIDocs,
        ComponentSignature,
        ...userOptions?.topLevelScope,
      },
      /**
       * Documentation can only be in markdown.
       */
      format: 'glimdown',
    };

    // @ts-expect-error - bah
    let output = use(REPLCompiled(markdownText, options));

    return () => output.current;
  });
}

