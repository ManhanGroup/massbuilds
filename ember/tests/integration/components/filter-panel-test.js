import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { MockMapService } from '../../mocks/mock-map-service';


module('Integration | Component | filter panel', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.owner.register('service:map', MockMapService);
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('updateFilter', (updateValues) => {
      // update children
      assert.equal(updateValues, updateValues) // this assert is not called in the current tests
    })
    this.set('toggleFilters', () => {
      assert.ok(this) // this assert is not called in the current tests
    })
    this.set('activeFilters', [])
    
    await render(hbs`{{filter-panel
      update=(action updateFilter)
      activeFilters=activeFilters
      toggleFilters=(action toggleFilters)
    }}`);

    assert.dom('*').hasText("Filters Close Town/City Neighborhood APN Developer Key Info Residential School Commercial 0");
  });
});
