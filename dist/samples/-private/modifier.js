import { modifier } from 'ember-modifier';

const functionModifierA = modifier((element, positional, named) => {
  // eslint-disable-next-line no-console
  console.log(element, positional, named);
});
const functionModifierB = modifier((element, positional, named) => {
  // eslint-disable-next-line no-console
  console.log(element, positional, named);
});
const functionModifierC = modifier((element, positional, named) => {
  // eslint-disable-next-line no-console
  console.log(element, positional, named);
});

export { functionModifierA, functionModifierB, functionModifierC };
//# sourceMappingURL=modifier.js.map
