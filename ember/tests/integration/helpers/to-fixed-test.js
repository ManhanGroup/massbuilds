
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:to-fixed', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', 123.0352);
    this.set('decimals', 3)
    await render(hbs`{{to-fixed inputValue decimals}}`);

    assert.dom('*').hasText('123.035');
  });
});

