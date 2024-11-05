import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { g, i } from 'decorator-transforms/runtime';

class CompileState {
  static {
    g(this.prototype, "isCompiling", [tracked], function () {
      return true;
    });
  }
  #isCompiling = (i(this, "isCompiling"), void 0);
  static {
    g(this.prototype, "error", [tracked], function () {
      return null;
    });
  }
  #error = (i(this, "error"), void 0);
  static {
    g(this.prototype, "component", [tracked]);
  }
  #component = (i(this, "component"), void 0);
  #promise;
  #resolve;
  #reject;
  constructor() {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }
  then = (...args) => this.#promise.then(...args);
  success = component => {
    assert(`Resolve is missing`, this.#resolve);
    this.component = component;
    this.isCompiling = false;
    this.error = null;
    this.#resolve(component);
  };
  fail = error => {
    assert(`Reject is missing`, this.#reject);
    this.error = error;
    this.#reject(error);
  };
  get isReady() {
    return !this.isCompiling;
  }
}

export { CompileState };
//# sourceMappingURL=compile-state.js.map
