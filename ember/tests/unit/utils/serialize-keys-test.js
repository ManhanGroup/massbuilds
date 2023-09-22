import serializeKeys from 'calbuilds/utils/serialize-keys';
import { module, test } from 'qunit';
import { camelize } from '@ember/string';

module('Unit | Utility | serialize keys', function() {
  // Test camelize
  test('it works', function(assert) {
    const input = {
      'Neighborhood-one': 'nhood-nbhood',
      'APNtoday': 'apn',
      'DeveloperSchmeveloper': 'devlper',
      'Town/City-camelmePlease': 'municipal',
    };

    const expectedResult = {
      'neighborhoodOne': 'nhood-nbhood',
      'aPNtoday': 'apn',
      'developerSchmeveloper': 'devlper',
      'town/cityCamelmePlease': 'municipal',
    };

    let result = serializeKeys(input, camelize);
    
    assert.equal(JSON.stringify(result), JSON.stringify(expectedResult))
  });
});
