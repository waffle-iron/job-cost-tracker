import traverse from 'traverse';
import mung from 'express-mung';

function _idToId(body, req, res) {
  let transformedBody = JSON.parse(JSON.stringify(body));
  traverse(transformedBody).forEach(function(value) {
    if (this.key === '_id') {
      this.parent.node['id'] = value;
      this.remove();
    }
  });
  return transformedBody;
}

module.exports = mung.json(_idToId);
