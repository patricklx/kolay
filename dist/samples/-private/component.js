import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

/* eslint-disable ember/no-empty-glimmer-component-classes */
class ClassA extends Component {}
class ClassB extends Component {}
const TemplateOnlyC = setComponentTemplate(precompileTemplate("hi there", {
  strictMode: true
}), templateOnly());
const TemplateOnlyD = setComponentTemplate(precompileTemplate("hi", {
  strictMode: true
}), templateOnly());

export { ClassA, ClassB, TemplateOnlyC, TemplateOnlyD };
//# sourceMappingURL=component.js.map
