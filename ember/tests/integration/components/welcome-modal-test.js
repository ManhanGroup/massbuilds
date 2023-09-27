import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | welcome modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{welcome-modal}}`);

    assert.dom('*').hasText("Welcome to CalBuilds! x CalBuilds is your Metropolitan Planning Organization’s collaborative inventory of past, present and future real estate development projects. This tool provides governments, data analysts, urban planners, community advocates, and real estate developers with comprehensive data for thousands of projects across California. Learn more Continue to CalBuilds");
  });
});
