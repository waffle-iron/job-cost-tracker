export default function() {
  return function(hook) {
    const lotsService = hook.app.service('/lots');
    const task = JSON.parse(JSON.stringify(hook.result));
    if (task.lot) {
      return lotsService.get(task.lot, hook.params)
        .then(lot => {
          lot = lot.toObject();
          lot.tasks.push(task._id);
          return lotsService.update(lot._id, lot, hook.params);
        })
        .then(result => {
          return hook;
        }, err => {
          console.error(err); //eslint-disable-line no-console
          return hook;
        });
    }
    return Promise.resolve(hook);
  };
}
