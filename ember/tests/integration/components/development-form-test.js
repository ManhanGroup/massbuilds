import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { MockMapService } from '../../mocks/mock-map-service';

module('Integration | Component | development form', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.owner.register('service:map', MockMapService);
  });
  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    this.set('editing', {'parkType': 0})
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`
      {{development-form
        editing=editing
      }}
    `);

    assert.dom('*').hasText("Create Development Development Name Latitude Longitude Drag map to set location Meta Data Developer Description Additional Notes PROJID Traffic Count URL Key Info Open to Public View? Status Select Status Completed In Construction Planning Projected Unverified Comments on Status Year complete Complete Date Estimated? Complete Date within the Current RHNA Cycle? Place Type SB Type SB6 SB8 Other Cost of Construction $ Project Area Parking Type Garage Underground Surface Other Attributes: Redevelopment , Phased , Stalled , As of Right , Mixed Use Residential Group Quarters Population Attributes: Age Restricted Housing Units Enter quantity of each unit type below Unit Type Quantity Percentage Single Family 0% Multi-family 0% Mobile Home 0% Unknown 0% Unit Style Quantity Percentage Studio/1 Bedroom 0% 2 Bedroom 0% 3 Bedroom 0% Affordable Units Enter quantity of each unit type below Unit Type Quantity Percentage Units <50% AMI 0% Units 50-80% AMI 0% Units 80-120% AMI 0% Above Units 120% AMI 0% Unknown 0% Commercial Public Area Hotel Rooms Attributes: Company Headquarters Commercial Area Enter the floor area for each use type below Use Type Floor Area (sqft.) Percentage Retail 0% Office/Medical 0% Industrial/Manufacturing 0% Warehouse/Shipping 0% Research/Development 0% Educational/Institutional 0% Hotel Room 0% Other 0% Unknown 0% Reported Employment Enter the number of employment for each use type below Use Type # of Employment Percentage Education 0% Food Service 0% Government 0% Industry 0% Medical Service 0% Office 0% Other 0% Retail 0% Service 0% * = required field");
    
    // check that the submit button is disabled
    const submitButton = find('#submitDevelopmentFormButton')
    assert.ok(submitButton.attributes.getNamedItem("disabled"))
  });

  // WIP attempt to test that valid input enables the submit button
  /*
  test("input validation", async function(assert) {

    this.set('editing', {
      'parkType': 0,
      "name": "test development",
      "latitude": 101.9,
      "longitude": 202.392,
      "descr": "development for testing",
      "status": "Planning",
      "yearCompl": "2030",
      "singfamhu": 20,
      "multifam": 0,
      "mobile": 0
    })

    await render(hbs`{{development-form
        editing=editing
        developmentTypeEnabled=true
        developmentType="Residential"
    }}`);

    assert.dom('*').hasText("Create Development Development Name Latitude Longitude Drag map to set location Meta Data Developer Description Additional Notes PROJID Traffic Count URL Key Info Status Select Status Completed In Construction Planning Projected Comments on Status Year complete Complete Date Estimated? Place Type SB Type SB6 SB8 Other Cost of Construction $ Project Area Parking Type Garage Underground Surface Other Attributes: Redevelopment , Phased , Stalled , As of Right , Mixed Use Residential Group Quarters Population Attributes: Age Restricted Housing Units Enter quantity of each unit type below Unit Type Quantity Percentage Single Family 0% Multi-family 0% Mobile Home 0% Unknown 0% Unit Style Quantity Percentage Studio/1 Bedroom 0% 2 Bedroom 0% 3 Bedroom 0% Affordable Units Enter quantity of each unit type below Unit Type Quantity Percentage Units <50% AMI 0% Units 50-80% AMI 0% Units 80-120% AMI 0% Above Units 120% AMI 0% Unknown 0% Commercial Public Area Hotel Rooms Attributes: Company Headquarters Commercial Area Enter the floor area for each use type below Use Type Floor Area (sqft.) Percentage Retail 0% Office/Medical 0% Industrial/Manufacturing 0% Warehouse/Shipping 0% Research/Development 0% Educational/Institutional 0% Hotel Room 0% Other 0% Unknown 0% Reported Employment Enter the number of employment for each use type below Use Type # of Employment Percentage Education 0% Food Service 0% Government 0% Industry 0% Medical Service 0% Office 0% Other 0% Retail 0% Service 0% * = required field");
    
    assert.dom("#development_name").hasValue("test development")
    assert.dom(".options").exists()
    await click("#residentialDevelopmentTypeButton")
    
    // check that the submit button is enabled
    assert.dom("#submitDevelopmentFormButton").doesNotHaveAttribute("disabled")
  })
*/
});
