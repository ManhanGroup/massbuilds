import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
// import { MockMapService } from '../../mocks/mock-map-service';


module('Integration | Component | mapbox map', function(hooks) {
  setupRenderingTest(hooks);
  // hooks.beforeEach(function () {
  //   this.owner.register('service:map', MockMapService);
  // });
  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('activeFilters', [])
    this.set('viewDevelopment', () => {
      assert.ok(this) // tbd is this gets called
    })

    await render(hbs`{{mapbox-map
      activeFilters=activeFilters
      viewDevelopment=(action viewDevelopment)
    }}`);

    assert.dom('*').hasText("© Mapbox © OpenStreetMap Improve this map");
  });
});
