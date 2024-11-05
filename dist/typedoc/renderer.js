import { hash } from '@ember/helper';
import { Compiled } from '../services/kolay/compiler/reactive.js';
import { Load } from './utils.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

const APIDocs = setComponentTemplate(precompileTemplate("\n  <Load @module={{@module}} @name=\"{{@name}}\" @package={{@package}} as |info|>\n    <Declaration @info={{info}} />\n  </Load>\n", {
  strictMode: true,
  scope: () => ({
    Load,
    Declaration
  })
}), templateOnly());
/**
 * Used for referencing the comment on a const or class.
 *
 * For example:
 * ```
 * /*
 *  * Comment block here is what is targeted
 *  *\/
 * export const CommentQuery ...
 * ```
 *
 * Usage:
 * ```hbs
 * <CommentQuery @name="CommentQuery" ... />
 * ```
 */
const CommentQuery = setComponentTemplate(precompileTemplate("\n  <Load @package={{@package}} @module={{@module}} @name={{@name}} as |info|>\n    <Comment @info={{info}} />\n  </Load>\n", {
  strictMode: true,
  scope: () => ({
    Load,
    Comment
  })
}), templateOnly());
const join = lines1 => lines1.join('\n');
const text = lines1 => lines1.map(line1 => line1.text);
function isGlimmerComponent(info1) {
  let extended1 = info1?.extendedTypes?.[0];
  if (!extended1) return false;
  return extended1.name === 'default' && extended1.package === '@glimmer/component';
}
const Comment = setComponentTemplate(precompileTemplate("\n  {{#if @info.comment.summary}}\n    {{#let (Compiled (join (text @info.comment.summary))) as |compiled|}}\n      {{#if compiled.isReady}}\n        <div class=\"typedoc-rendered-comment\">\n          <compiled.component />\n        </div>\n      {{/if}}\n    {{/let}}\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    Compiled,
    join,
    text
  })
}), templateOnly());
const isIgnored = name1 => ['__type', 'TOC', 'TemplateOnlyComponent'].includes(name1);
const isConst = x1 => x1.flags.isConst;
const not = x1 => !x1;
const Declaration = setComponentTemplate(precompileTemplate("\n  {{#if @info}}\n    <div class=\"typedoc__declaration\">\n      {{#if (not (isIgnored @info.name))}}\n        <span class=\"typedoc__declaration-name\">{{@info.name}}</span>\n      {{/if}}\n\n      {{#if (isConst @info)}}\n        <Comment @info={{@info}} />\n      {{/if}}\n\n      {{#if @info.type}}\n        <Type @info={{@info.type}} />\n      {{/if}}\n\n      {{#if @info.children}}\n        <ul class=\"typedoc__declaration-children\">\n          {{#each @info.children as |child|}}\n            <li><Declaration @info={{child}} /></li>\n          {{/each}}\n        </ul>\n      {{/if}}\n\n      {{#if @info.signatures}}\n        <ul class=\"typedoc__declaration-signatures\">\n          {{#each @info.signatures as |child|}}\n            {{!-- @glint-expect-error --}}\n            <li><Type @info={{child}} /></li>\n          {{/each}}\n        </ul>\n      {{/if}}\n\n      {{#if (not (isConst @info))}}\n        {{#if @info.comment.summary}}\n          <Comment @info={{@info}} />\n        {{/if}}\n      {{/if}}\n    </div>\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    not,
    isIgnored,
    isConst,
    Comment,
    Type,
    Declaration
  })
}), templateOnly());
const Reflection = setComponentTemplate(precompileTemplate("<Declaration @info={{@info.declaration}} />", {
  strictMode: true,
  scope: () => ({
    Declaration
  })
}), templateOnly());
const isReference = x1 => x1?.type === 'reference';
const isReflection = x1 => x1?.type === 'reflection';
const isIntrinsic = x1 => x1?.type === 'intrinsic';
const isTuple = x1 => x1?.type === 'tuple';
const isNamedTuple = x1 => x1?.type === 'namedTupleMember';
const isVoidIntrinsic = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('type' in x1)) return false;
  if (typeof x1.type === 'object' && x1.type !== null) {
    if ('type' in x1.type && 'name' in x1.type) {
      return x1.type.type === 'intrinsic' && x1.type.name === 'void';
    }
  }
  return false;
};
const isArray = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('type' in x1)) return false;
  return x1.type === 'array';
};
const isFn = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('name' in x1)) return false;
  if (!('variant' in x1)) return false;
  return x1.variant === 'signature';
};
const isUnknownType = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('type' in x1)) return false;
  return x1.type === 'unknown';
};
const isUnion = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('type' in x1)) return false;
  return x1.type === 'union';
};
const isLiteral = x1 => {
  if (!x1) return false;
  if (typeof x1 !== 'object') return false;
  if (x1 === null) return false;
  if (!('type' in x1)) return false;
  return x1.type === 'literal';
};
// function typeArg(info: DeclarationReference) {
//   let extended = info?.extendedTypes?.[0]
//   if (!extended) return false;
//   return extended.typeArguments[0]
// }
//
const isInvokable = info1 => info1.name === 'Invokable';
const Reference = setComponentTemplate(precompileTemplate("\n  {{#if (isInvokable @info)}}\n    <div class=\"typedoc__unknown__yield\">\n      <Intrinsic @info={{hash name=\"Component\"}} />\n    </div>\n  {{else}}\n    <div class=\"typedoc__reference\">\n      {{#if (not (isIgnored @info.name))}}\n        <div class=\"typedoc__reference__name\">{{@info.name}}</div>\n      {{/if}}\n      {{#if @info.typeArguments.length}}\n        <div class=\"typedoc__reference__typeArguments\">\n          &lt;\n          {{#each @info.typeArguments as |typeArg|}}\n            <div class=\"typedoc__reference__typeArgument\">\n              <Type @info={{typeArg}} />\n            </div>\n          {{/each}}\n          &gt;\n        </div>\n      {{/if}}\n    </div>\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    isInvokable,
    Intrinsic,
    hash,
    not,
    isIgnored,
    Type
  })
}), templateOnly());
const Intrinsic = setComponentTemplate(precompileTemplate("\n  <span class=\"typedoc__intrinsic\">{{@info.name}}</span>\n", {
  strictMode: true
}), templateOnly());
const VoidIntrinsic = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__void_intrinsic\">\n    {{!-- @glint-expect-error --}}\n    <Function @info={{@info}} />\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    Function
  })
}), templateOnly());
const Tuple = setComponentTemplate(precompileTemplate("\n  {{#each @info.elements as |element|}}\n    <Type @info={{element}} />\n  {{/each}}\n", {
  strictMode: true,
  scope: () => ({
    Type
  })
}), templateOnly());
const NamedTuple = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__named-tuple\">\n    <div class=\"typedoc__name\">{{@info.name}}</div>\n    <Type @info={{@info.element}} />\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    Type
  })
}), templateOnly());
const Array = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__array\">\n    <div class=\"typedoc__array__indicator\">Array of</div>\n    <Type @info={{@info.elementType}} />\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    Type
  })
}), templateOnly());
const Function = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__function\">\n    <div class=\"typedoc__function_comment\">\n      <Comment @info={{@info}} />\n    </div>\n    <div class=\"typedoc__function__type\">\n      <div class=\"typedoc__function__open\">(</div>\n      <div class=\"typedoc__function__parameters\">\n        {{#each @info.parameters as |param|}}\n          <div class=\"typedoc__function__parameter__container\">\n            <div class=\"typedoc__function__parameter\">\n              <div class=\"typedoc__function__parameter__name\">{{param.name}}</div>\n              <div class=\"typedoc__function__parameter__type\">\n                {{!-- @glint-expect-error --}}\n                <Type @info={{param.type}} />\n              </div>\n            </div>\n            <div class=\"typedoc__function__parameter__comment\">\n              <Comment @info={{param}} />\n            </div>\n          </div>\n        {{/each}}\n      </div>\n      <div class=\"typedoc__function__close\">) =></div>\n      <div class=\"typedoc__function__return_type\">\n        {{!-- @glint-expect-error --}}\n        <Type @info={{@info.type}} />\n      </div>\n    </div>\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    Comment,
    Type
  })
}), templateOnly());
const Unknown = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__unknown\">\n    {{@info.name}}\n  </div>\n", {
  strictMode: true
}), templateOnly());
const Union = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__union\">\n    {{#each @info.types as |type|}}\n      <div class=\"typedoc__union__type\">\n        <Type @info={{type}} />\n      </div>\n    {{/each}}\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    Type
  })
}), templateOnly());
const literalAsString = x1 => {
  if (typeof x1 === 'string') {
    return `"${x1}"`;
  }
  if (typeof x1 === 'number' || typeof x1 === 'boolean' || x1 === null) {
    return `${x1}`;
  }
  return x1.toString();
};
const Literal = setComponentTemplate(precompileTemplate("\n  <div class=\"typedoc__literal\">\n    {{literalAsString @info.value}}\n  </div>\n", {
  strictMode: true,
  scope: () => ({
    literalAsString
  })
}), templateOnly());
const Type = setComponentTemplate(precompileTemplate("\n  {{#if (isReference @info)}}\n    {{!-- @glint-expect-error --}}\n    <Reference @info={{@info}} />\n  {{else if (isReflection @info)}}\n    {{!-- @glint-expect-error --}}\n    <Reflection @info={{@info}} />\n  {{else if (isIntrinsic @info)}}\n    {{!-- @glint-expect-error --}}\n    <Intrinsic @info={{@info}} />\n  {{else if (isTuple @info)}}\n    {{!-- @glint-expect-error --}}\n    <Tuple @info={{@info}} />\n  {{else if (isNamedTuple @info)}}\n    <NamedTuple @info={{@info}} />\n  {{else if (isVoidIntrinsic @info)}}\n    {{!-- @glint-expect-error --}}\n    <VoidIntrinsic @info={{@info}} />\n  {{else if (isArray @info)}}\n    <Array @info={{@info}} />\n  {{else if (isFn @info)}}\n    {{!-- @glint-expect-error --}}\n    <Function @info={{@info}} />\n  {{else if (isUnion @info)}}\n    <Union @info={{@info}} />\n  {{else if (isLiteral @info)}}\n    <Literal @info={{@info}} />\n  {{else if (isUnknownType @info)}}\n    <Unknown @info={{@info}} />\n  {{else}}\n    {{!-- template-lint-disable no-log --}}\n    {{log \"Unknown Type\" @info}}\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    isReference,
    Reference,
    isReflection,
    Reflection,
    isIntrinsic,
    Intrinsic,
    isTuple,
    Tuple,
    isNamedTuple,
    NamedTuple,
    isVoidIntrinsic,
    VoidIntrinsic,
    isArray,
    Array,
    isFn,
    Function,
    isUnion,
    Union,
    isLiteral,
    Literal,
    isUnknownType,
    Unknown
  })
}), templateOnly());

export { APIDocs, Comment, CommentQuery, NamedTuple, Type, isGlimmerComponent, isIntrinsic, isNamedTuple };
//# sourceMappingURL=renderer.js.map
