import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { MockMapService } from '../../mocks/mock-map-service';
import { run } from '@ember/runloop';


module('Integration | Component | search bar', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.owner.register('service:map', MockMapService);
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('searchQuery', '') // blank so that an online search isn't performed
    this.set('model', [run(() => this.owner.lookup('service:store').createRecord('development', {
          name: 'Neighborhood'
        }))])
    await render(hbs`{{search-bar
      searchQuery=searchQuery
      model=model
    }}`);

    assert.dom('*').hasText("x");
  });
});
