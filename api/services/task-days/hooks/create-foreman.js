import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';

function createForeman(hook) {
  const foremanService = hook.app.service('/foremen');
  const foreman = hook.data.foreman;
  const foremanCreation = isObject(foreman) && !foreman._id ? foremanService.create(foreman, hook.params) : Promise.resolve(foreman);

  return foremanCreation.then((result) => {
    hook.data.foreman = isObject(result) ? result._id : result;

    return hook;
  });
}

export default function(options) {
  return function(hook) {
    if (hook.data.foreman){
      return Promise.resolve(createForeman(hook));
    }

    return Promise.resolve(hook);
  };
}
