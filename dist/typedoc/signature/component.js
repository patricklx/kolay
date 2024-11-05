import { Type, Comment } from '../renderer.js';
import { Load, findChildDeclaration } from '../utils.js';
import { Args } from './args.js';
import { Element } from './element.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

function findReferenceByFilename(name1, fileName1, info1) {
  if (!info1.children) return;
  for (let child1 of info1.children) {
    if (child1.sources[0].fileName === fileName1) {
      return child1;
    }
    if (!child1.children) continue;
    let isRelevant1 = child1.children.find(grandChild1 => grandChild1.sources[0].fileName === fileName1);
    if (isRelevant1) {
      return isRelevant1;
    }
    let grand1 = findReferenceByFilename(name1, fileName1, child1);
    if (grand1) return grand1;
  }
}
function getSignatureType(info1, doc1) {
  /**
  * export const Foo: TOC<{ signature here }> = <template> ... </template>
  */
  if (info1.type?.type === 'reference' && info1.type?.typeArguments?.[0]?.type === 'reflection') {
    return info1.type.typeArguments[0].declaration;
  }
  /**
  * export class Foo extends Component<{ signature here }> { ... }
  */
  if (info1.variant === 'declaration' && 'extendedTypes' in info1) {
    let extendedType1 = info1.extendedTypes?.[0];
    if (extendedType1?.type === 'reference' && extendedType1?.package === '@glimmer/component') {
      let typeArg1 = extendedType1.typeArguments?.[0];
      if (typeArg1?.type === 'reflection') {
        return typeArg1.declaration;
      }
      if (typeArg1?.type === 'reference') {
        if ('symbolIdMap' in doc1) {
          // This is hard, maybe typedoc has a util?
          return findReferenceByFilename(typeArg1.name, extendedType1.target.sourceFileName, doc1);
        }
      }
    }
  }
  /**
  * export interface Signature { ... }
  */
  return info1;
}
function getSignature(info1, doc1) {
  let type1 = getSignatureType(info1, doc1);
  if (!type1) {
    console.warn('Could not finde signature');
    return;
  }
  return {
    Element: findChildDeclaration(type1, 'Element'),
    Args: findChildDeclaration(type1, 'Args'),
    Blocks: findChildDeclaration(type1, 'Blocks')
  };
}
const ComponentSignature = setComponentTemplate(precompileTemplate("\n  <Load @package={{@package}} @module={{@module}} @name={{@name}} as |declaration doc|>\n    {{#let (getSignature declaration doc) as |info|}}\n      <Element @kind=\"component\" @info={{info.Element}} />\n      <Args @kind=\"component\" @info={{info.Args}} />\n      <Blocks @info={{info.Blocks}} />\n    {{/let}}\n  </Load>\n", {
  strictMode: true,
  scope: () => ({
    Load,
    getSignature,
    Element,
    Args,
    Blocks
  })
}), templateOnly());
const Blocks = setComponentTemplate(precompileTemplate("\n  {{#if @info}}\n    <h3 class=\"typedoc__heading\">Blocks</h3>\n    {{#each @info.type.declaration.children as |child|}}\n      <span class=\"typedoc__component-signature__block\">\n        <pre class=\"typedoc__name\">&lt;:{{child.name}}&gt;</pre>\n        {{!-- <span class='typedoc-category'>Properties </span> --}}\n        <div class=\"typedoc__property\">\n          <Type @info={{child.type}} />\n          <Comment @info={{child}} />\n        </div>\n      </span>\n    {{/each}}\n  {{/if}}\n", {
  strictMode: true,
  scope: () => ({
    Type,
    Comment
  })
}), templateOnly());

export { ComponentSignature };
//# sourceMappingURL=component.js.map
