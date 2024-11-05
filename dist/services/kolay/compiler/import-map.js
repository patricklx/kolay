import * as eModifier from 'ember-modifier';
import * as emberResources from 'ember-resources';
import * as trackedBuiltIns from 'tracked-built-ins';
import { Logs } from '../../../components/logs.js';
import { Page } from '../../../components/page.js';
import { APIDocs, CommentQuery } from '../../../typedoc/renderer.js';
import { ComponentSignature } from '../../../typedoc/signature/component.js';

function getDefaultOptions() {
  return {
    format: 'glimdown',
    importMap: {
      'ember-resources': emberResources,
      'tracked-built-ins': trackedBuiltIns,
      'ember-modifier': eModifier,
      kolay: {
        APIDocs,
        ComponentSignature,
        CommentQuery
      },
      'kolay/components': {
        Logs,
        Page
      }
    }
  };
}

export { getDefaultOptions };
//# sourceMappingURL=import-map.js.map
