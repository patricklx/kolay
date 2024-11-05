import { Type } from '../renderer.js';
import { Load } from '../utils.js';
import { Args, getArgs } from './args.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

function getSignature(info1) {
  /**
  * export const Foo: HelperLike<{...}>
  */
  if (info1.variant === 'declaration' && info1.type?.type === 'reference' && info1.type?.package === '@glint/template' && info1.type?.name === 'HelperLike' && Array.isArray(info1.type?.typeArguments) && info1.type.typeArguments[0] && 'declaration' in info1.type.typeArguments[0]) {
    // There can only be one type argument for a HelperLike
    return info1.type.typeArguments[0]?.declaration;
  }
  /**
  * export class MyHelper extends ...
  */
  if (Array.isArray(info1.extendedTypes) && info1.extendedTypes.length > 0) {
    let firstExtended1 = info1.extendedTypes[0];
    /**
    * import Helper from '@ember/component/helper';
    *
    * export class MyHelper extends Helper<{...}>
    */
    if (firstExtended1?.type === 'reference' && firstExtended1.package === 'ember-source' && firstExtended1.qualifiedName.includes('/helper') && Array.isArray(firstExtended1.typeArguments) && firstExtended1.typeArguments[0] && 'declaration' in firstExtended1.typeArguments[0]) {
      return firstExtended1.typeArguments[0].declaration;
    }
  }
  /**
  * export function(...): return;
  */
  if (info1.signatures) {
    return info1.signatures;
  }
  /**
  * export interface Signature { ... }
  */
  return info1;
}
function getReturn(info1) {
  if (info1.variant === 'signature') {
    return info1.type;
  }
  if (Array.isArray(info1)) {
    return info1.find(item1 => item1.name === 'Return')?.type;
  }
  if ('children' in info1) {
    return getReturn(info1.children);
  }
}
const Return = setComponentTemplate(precompileTemplate("\n  {{#if @info}}\n    <div class=\"typedoc__helper__return\">\n      <h3 class=\"typedoc__heading\">Return</h3>\n\n      <Type @info={{@info}} />\n    </div>\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    Type
  })
}), templateOnly());
const HelperSignature = setComponentTemplate(precompileTemplate("\n  <Load @package={{@package}} @module={{@module}} @name={{@name}} as |declaration|>\n    {{#let (getSignature declaration) as |info|}}\n      {{#if (globalThis.Array.isArray info)}}\n        {{#each info as |signature|}}\n          <Args @kind=\"helper\" @info={{getArgs signature}} />\n          <Return @info={{getReturn signature}} />\n        {{/each}}\n      {{else}}\n        {{!-- Whenever we have a \"Full Signature\" or \"HelperLike\" definition --}}\n        <Args @kind=\"helper\" @info={{getArgs info}} />\n        <Return @info={{getReturn info}} />\n      {{/if}}\n\n    {{/let}}\n  </Load>\n", {
  strictMode: true,
  scope: () => ({
    Load,
    getSignature,
    globalThis,
    Args,
    getArgs,
    Return,
    getReturn
  })
}), templateOnly());

export { HelperSignature };
//# sourceMappingURL=helper.js.map
