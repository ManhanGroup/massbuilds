import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';


const termStub = Service.extend({
  openTerm: 'DEVELOPER',
  element: null
})

module('Integration | Component | click catcher', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:term', termStub);
    this.set('termService', termStub)
  });
  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{click-catcher}}`);

    assert.dom('*').hasText("Developer If known, enter the project developer(s) only (not including construction team, architects, etc)");
  });

  test('invalid term entry', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.termService = this.owner.lookup('service:term');
    this.set('termService.openTerm', 'NOT_A_TERM')

    await render(hbs`{{click-catcher}}`);

    assert.dom('*').hasText("")
  });
});
