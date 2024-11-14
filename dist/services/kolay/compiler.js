import Service, { service } from '@ember/service';
import { Shadowed } from 'ember-primitives/components/shadowed';
import { compile } from 'ember-repl';
import { APIDocs, CommentQuery } from '../../typedoc/renderer.js';
import { ComponentSignature } from '../../typedoc/signature/component.js';
import { HelperSignature } from '../../typedoc/signature/helper.js';
import { ModifierSignature } from '../../typedoc/signature/modifier.js';
import { CompileState } from './compiler/compile-state.js';
import { getDefaultOptions } from './compiler/import-map.js';
import { g, i } from 'decorator-transforms/runtime';

class Compiler extends Service {
  static {
    g(this.prototype, "docs", [service('kolay/docs')]);
  }
  #docs = (i(this, "docs"), void 0);
  // for debugging in the inspector / console

  compileMD = code => {
    let state = new CompileState();
    this.last = state;
    if (!code) {
      return state;
    }
    let {
      additionalResolves: importMap,
      additionalTopLevelScope: topLevelScope,
      remarkPlugins,
      rehypePlugins
    } = this.docs;
    let defaults = getDefaultOptions();
    compile(code, {
      ...defaults,
      /**
       * Documentation can only be in markdown.
       */
      format: 'glimdown',
      ShadowComponent: 'Shadowed',
      remarkPlugins,
      rehypePlugins,
      importMap: {
        ...defaults.importMap,
        ...importMap
      },
      topLevelScope: {
        Shadowed,
        APIDocs,
        CommentQuery,
        ComponentSignature,
        ModifierSignature,
        HelperSignature,
        ...topLevelScope
      },
      onSuccess: async component => state.success(component),
      onError: async e => state.fail(e),
      onCompileStart: async () => state.isCompiling = true
    });
    return state;
  };
}

export { Compiler as default };
//# sourceMappingURL=compiler.js.map
