import { isIntrinsic, Type, isNamedTuple, Comment } from '../renderer.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

const not = x1 => !x1;
const isComponent = kind1 => kind1 === 'component';
/**
 * Only components' args are prefixed with a `@`,
 * because only components have template-content.
 */
const Args = setComponentTemplate(precompileTemplate("\n  {{#if @info}}\n    <h3 class=\"typedoc__heading\">Arguments</h3>\n    {{#each (listifyArgs @info) as |child|}}\n      <span class=\"typedoc__{{@kind}}-signature__arg\">\n        <span class=\"typedoc__{{@kind}}-signature__arg-info\">\n          <pre class=\"typedoc__name\">{{if (isComponent @kind) \"@\"}}{{child.name}}</pre>\n          {{#if (isIntrinsic child.type)}}\n            <Type @info={{child.type}} />\n          {{else if (isNamedTuple child)}}\n            <Type @info={{child.element}} />\n          {{/if}}\n        </span>\n        {{#if (not (isIntrinsic child.type))}}\n          <Type @info={{child.type}} />\n        {{else if (isNamedTuple child)}}\n          <Type @info={{child.element}} />\n        {{else}}\n          <Comment @info={{child}} />\n        {{/if}}\n      </span>\n    {{/each}}\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    listifyArgs,
    isComponent,
    isIntrinsic,
    Type,
    isNamedTuple,
    not,
    Comment
  })
}), templateOnly());
function listifyArgs(info1) {
  if (!info1) return [];
  if (Array.isArray(info1)) {
    return info1;
  }
  /**
  * This object *may* have Named and Positional on them,
  * in which case, we want to create [...Postiional, Named]
  */
  if ('children' in info1 && Array.isArray(info1.children)) {
    if (info1.children.length <= 2) {
      let flattened1 = flattenArgs(info1.children);
      if (flattened1.length > 0) {
        return flattened1;
      }
    }
    return info1.children;
  }
  if (info1.type && 'declaration' in info1.type && info1.type.declaration) {
    return listifyArgs(info1.type.declaration);
  }
  // eslint-disable-next-line no-console
  console.warn('unhandled', info1);
  return [];
}
function flattenArgs(args1) {
  let named1 = args1.find(x1 => x1.name === 'Named');
  let positional1 = args1.find(x1 => x1.name === 'Positional');
  let result1 = [];
  if (positional1) {
    result1.push(positional1.type?.elements);
  }
  if (named1) {
    result1.push(named1);
  }
  return result1.flat();
}
/**
 * Returns args for either a function or signature
 */
function getArgs(info1) {
  if ('parameters' in info1) {
    return info1.parameters;
  }
  if (Array.isArray(info1)) {
    return info1.find(item1 => item1.name === 'Args');
  }
  if ('children' in info1) {
    return getArgs(info1.children);
  }
}

export { Args, getArgs };
//# sourceMappingURL=args.js.map
