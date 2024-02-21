import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NotHere extends Route {
  @service router;

  beforeModel() {
    this.router.replaceWith('/usage/setup.md');
  }
}
