import { Load, findChildDeclaration } from '../utils.js';
import { Args } from './args.js';
import { Element } from './element.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

/** eslint-disable @typescript-eslint/no-unused-vars */
function getSignatureType(info1) {
  /**
  * export const Foo: TOC<{ signature here }> = <template> ... </template>
  */
  if (info1.type?.type === 'reference' && info1.type?.typeArguments?.[0]?.type === 'reflection') {
    return info1.type.typeArguments[0].declaration;
  }
  /**
  * import { modifier } from 'ember-modifier';
  *
  * export const foo = modifier<{ ... }>(() => {});
  */ /**
     * (implicit signature)
     *
     * import { modifier } from 'ember-modifier';
     *
     * export const foo = modifier(() => {});
     */
  if (info1.variant === 'declaration' && 'type' in info1) {
    if (info1.type.package === 'ember-modifier') ;
    /**
    * import type { ModifierLike } from '@glint/template';
    *
    * export const X: ModifierLike<{ ... }>
    */
    if (info1.type.package === '@glint/template' && Array.isArray(info1.type.typeArguments) && info1.type.typeArguments.length > 0) {
      return info1.type.typeArguments[0].declaration;
    }
  }
  if (info1.variant === 'declaration' && 'extendedTypes' in info1) {
    let extendedType1 = info1.extendedTypes?.[0];
    if (extendedType1?.type === 'reference' && extendedType1?.package === 'ember-modifier') {
      let typeArg1 = extendedType1.typeArguments?.[0];
      if (typeArg1?.type === 'reflection') {
        return typeArg1.declaration;
      }
    }
  }
  /**
  * export interface Signature { ... }
  */
  return info1;
}
function getSignature(info1) {
  let type1 = getSignatureType(info1);
  if (!type1) {
    console.warn('Could not finde signature');
    return;
  }
  return {
    Element: findChildDeclaration(type1, 'Element'),
    Args: findChildDeclaration(type1, 'Args')
  };
}
const ModifierSignature = setComponentTemplate(precompileTemplate("\n  <Load @package={{@package}} @module={{@module}} @name={{@name}} as |declaration|>\n    {{#let (getSignature declaration) as |info|}}\n      <Element @kind=\"modifier\" @info={{info.Element}} />\n      <Args @kind=\"modifier\" @info={{info.Args}} />\n    {{/let}}\n  </Load>\n", {
  strictMode: true,
  scope: () => ({
    Load,
    getSignature,
    Element,
    Args
  })
}), templateOnly());

export { ModifierSignature };
//# sourceMappingURL=modifier.js.map
