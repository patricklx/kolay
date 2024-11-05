import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';
import { g, i } from 'decorator-transforms/runtime';

function findChildDeclaration(info1, name1) {
  return info1.children?.find(child1 => child1.variant === 'declaration' && child1.name === name1);
}
const infoFor = (data1, module1, name1) => {
  let moduleType1 = data1.children?.find(child1 => child1.name === module1);
  assert(`Could not find module by name: ${module1}. Available modules in this set of api docs are: ${data1.children?.map(child1 => child1.name).join(', ')}`, moduleType1);
  let found1 = moduleType1?.children?.find(grandChild1 => grandChild1.name === name1);
  return found1;
};
const Query = setComponentTemplate(precompileTemplate("\n  {{#let (infoFor @info @module @name) as |info|}}\n    {{#if info}}\n      {{yield info}}\n    {{else}}\n      {{yield to=\"notFound\"}}\n    {{/if}}\n  {{/let}}\n", {
  strictMode: true,
  scope: () => ({
    infoFor
  })
}), templateOnly());
function isDeclarationReflection(info1) {
  return true;
}
const stringify = x1 => String(x1);
class Load extends Component {
  static {
    g(this.prototype, "apiDocs", [service('kolay/api-docs')]);
  }
  #apiDocs = (i(this, "apiDocs"), void 0);
  /**
  * TODO: move this to the service and dedupe requests
  */
  request = trackedFunction(this, async () => {
    let {
      package: pkg1
    } = this.args;
    if (!pkg1) {
      throw new Error(`A @package must be specified to load.`);
    }
    let req1 = await this.apiDocs.load(pkg1);
    let json1 = await req1.json();
    return json1;
  });
  static {
    setComponentTemplate(precompileTemplate("\n    {{#if this.request.isLoading}}\n      Loading api docs...\n    {{/if}}\n\n    {{#if this.request.isError}}\n      {{stringify this.request.error}}\n    {{/if}}\n\n    {{#if this.request.value}}\n      <section>\n        {{#if (isDeclarationReflection this.request.value)}}\n          <Query @info={{this.request.value}} @module={{@module}} @name={{@name}} as |type|>\n            {{yield type this.request.value}}\n          </Query>\n        {{/if}}\n      </section>\n    {{/if}}\n  ", {
      strictMode: true,
      scope: () => ({
        stringify,
        isDeclarationReflection,
        Query
      })
    }), this);
  }
}

export { Load, Query, findChildDeclaration, infoFor };
//# sourceMappingURL=utils.js.map
