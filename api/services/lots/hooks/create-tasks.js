import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';

function createTasks(hook) {
  const tasksService = hook.app.service('/tasks');
  const taskCreations = hook.data.tasks.map(task => {
    return isObject(task) && !task._id ? tasksService.create(task, hook.params) : Promise.resolve(task);
  });
  return Promise.all(taskCreations)
    .then(results => {
      hook.data.tasks = results.map(task => isObject(task) ? task._id : task);
      return hook;
    });
}

export default function(options) {
  return function(hook) {
    if (isArray(hook.data.tasks) && hook.data.tasks.length > 0) {
      return createTasks(hook);
    }
    return Promise.resolve(hook);
  };
}
