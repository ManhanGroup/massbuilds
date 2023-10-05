import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { MockMapService } from '../../mocks/mock-map-service';
import { run } from '@ember/runloop';


module('Integration | Component | discrete filter subpanel', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.owner.register('service:map', MockMapService);
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('update', () => {
      assert.ok(this) // currently, this assert is not expected to be reached
    })
    this.set('viewing', 
      run(() => this.owner.lookup('service:store').createRecord('development', {
        name: 'Neighborhood',
      }))
    );
    this.set('selectedValues', [])

    await render(hbs`{{discrete-filter-subpanel
      update=(action update)
      viewing=viewing
      selectedValues=selectedValues
    }}`);

    assert.dom('*').hasText('0');
  });
});
