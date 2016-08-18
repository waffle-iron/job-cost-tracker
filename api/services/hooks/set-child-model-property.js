import difference from 'lodash/array/difference';

function patchChildModels({ service, ids, property, value }, hook) {
  if (ids.length) {
    return Promise.all(ids.map(id => {
      return service.patch(id,
          { [property]: value },
          hook.params
        ).catch(err => {
          console.error(err); //eslint-disable-line no-console
        });
    }));
  }
  return Promise.resolve();
}

function getParentModels(hook, service) {
  if (hook.type === 'after') {
    return Promise.resolve(hook.result);
  }
  if (hook.id) {
    return service.get(hook.id, hook.params);
  }
  return service.find(hook.params.query, hook.params);
}

export function setChildModelProperty({
  parentService,
  parentProp=null,
  childService,
  childProp,
  childRef
}) {
  return function(hook) {
    return getParentModels(hook, hook.app.service(parentService))
      .then( parents => JSON.parse(JSON.stringify(parents)) )
      .then( parents => [].concat(parents)) // wrap single values in array
      .then( parents => {
        let updates = parents.map(parent => {
          return patchChildModels({
            service: hook.app.service(childService),
            ids: parent[childRef],
            property: childProp,
            value: parentProp ? parent[parentProp] : null
          }, hook);
        });
        return Promise.all( updates );
      })
      .then(results => {
        return hook;
      })
      .catch(e => {
        console.error(e); // eslint-disable-line no-console
        return hook;
      });

  };
}

export default setChildModelProperty;
