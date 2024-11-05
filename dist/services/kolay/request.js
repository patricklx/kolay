import { cached } from '@glimmer/tracking';
import { service } from '@ember/service';
import { use } from 'ember-resources';
import { keepLatest } from 'reactiveweb/keep-latest';
import { RemoteData } from 'reactiveweb/remote-data';
import { getOwner } from '@ember/owner';
import { g, i, n } from 'decorator-transforms/runtime';

const OUTPUT_PREFIX = `/docs/`;
const OUTPUT_PREFIX_REGEX = /^\/docs\//;

/**
 * With how data is derived here, the `fetch` request does not execute
 * if we know ahead of time that the fetch would fail.
 * e.g.: when the URL is not declared in the manifest.
 *
 * The `fetch` only occurs when `last` is accessd.
 * and `last` is not accessed if `doesPageExist` is ever false.
 */
class MDRequest {
  constructor(urlFn) {
    this.urlFn = urlFn;
  }
  static {
    g(this.prototype, "docs", [service('kolay/docs')]);
  }
  #docs = (i(this, "docs"), void 0);
  get config() {
    // @ts-ignore
    return getOwner(this).resolveRegistration('config:environment');
  }

  /**
   * TODO: use a private property when we move to spec-decorators
   */
  static {
    g(this.prototype, "last", [use], function () {
      return RemoteData(this.urlFn);
    });
  }
  #last = (i(this, "last"), void 0);
  static {
    g(this.prototype, "lastSuccessful", [use], function () {
      return keepLatest({
        value: () => this.#lastValue,
        when: () => this.hasError
      });
    });
  }
  #lastSuccessful = (i(this, "lastSuccessful"), void 0);
  get hasError() {
    if (!this._doesPageExist) return true;

    /**
     * Can't have an error if we haven't made a request yet
     */
    if (!this.last.status) return false;
    return this.last.status >= 400;
  }

  /**
   * TODO: use a private property when we move to spec-decorators
   */
  get _doesPageExist() {
    let url = this.urlFn();
    let pagePath = url.slice(this.config.rootURL.length - 1).replace(OUTPUT_PREFIX_REGEX, '/');
    let group = this.docs.groupForURL(pagePath);
    return Boolean(group);
  }
  static {
    n(this.prototype, "_doesPageExist", [cached]);
  }
  get #lastValue() {
    if (!this._doesPageExist) return '';
    return this.last.value;
  }
}

export { MDRequest, OUTPUT_PREFIX, OUTPUT_PREFIX_REGEX };
//# sourceMappingURL=request.js.map
