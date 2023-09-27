import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';


module('Integration | Component | metric filter subpanel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('update', () => {
      assert.ok(this) // currently, this assert is not expected to be reached
    })
    this.set('viewing', 
      run(() => this.owner.lookup('service:store').createRecord('development', {
        name: 'Residential',
      }))
    );
    this.set('activeFilters', [])

    await render(hbs`{{metric-filter-subpanel
        update=(action update)
        viewing=viewing
        activeFilters=activeFilters
    }}`);

    assert.dom('*').hasText("Units Total housing units > = < Single-family units > = < Multifamily units > = < Studio/1 bedroom units > = < 2 Bedroom units > = < 3 Bedroom units > = < Medium Density Multi-family > = < High Density Multi-family > = < Affordability Affordable units > = < Units <50% AMI > = < Units 50-80% AMI > = < Units 80-120% AMI > = < Above Units 120% AMI > = < Other Group quarters population > = < Age restricted");
  });
});
