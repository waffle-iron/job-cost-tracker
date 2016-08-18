import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';

function createLots(hook) {
  const lotsService = hook.app.service('/lots');
  const lotCreations = hook.data.lots.map(lot => {
    return isObject(lot) && !lot._id ? lotsService.create(lot, hook.params) : Promise.resolve(lot);
  });
  return Promise.all(lotCreations)
    .then(results => {
      hook.data.lots = results.map(lot => isObject(lot) ? lot._id : lot);
      return hook;
    });
}

export default function(options) {
  return function(hook) {
    if (isArray(hook.data.lots) && hook.data.lots.length > 0) {
      return createLots(hook);
    }
    return Promise.resolve(hook);
  };
}
