import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | signup subpanel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{signup-subpanel}}`);

    assert.dom('*').hasText("Signup Would you like to request verified status? No Yes, as a member state or regional government Yes, as a member of city or town government Signup Already have an account? Login here");
  });
});
