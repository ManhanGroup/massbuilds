import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | map legend', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{map-legend}}`);

    assert.dom('*').hasText("Completed In Construction Planning Projected Unverified Deselected");

    // Template block usage:
    // This component does accept template arguments in calbuilds! Add applicable arguments in future testing
    await render(hbs`
      {{#map-legend}}
      Completed In Construction Planning Projected Deselected
      {{/map-legend}}
    `);

    assert.dom('*').hasText("Completed In Construction Planning Projected Deselected");
  });
});
