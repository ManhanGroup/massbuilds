import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | login subpanel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{login-subpanel}}`);

    assert.dom('*').hasText('A visual database for detailed information on real-estate developments in AMBAG and SLOCOG region. Learn more Login Logging In Login Forgot password? Don\'t have an account? Signup here');
  });
});
