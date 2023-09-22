import castToModel from 'calbuilds/utils/cast-to-model';
import { module, test } from 'qunit';
import Development from 'calbuilds/models/development';

module('Unit | Utility | cast to model', function() {
  // object that looks like a development
  const data = {
    'name': 'development 1'
  }
  test('it works', function(assert) {
    let result = castToModel(Development, data);
    assert.ok(result);
  });
});
