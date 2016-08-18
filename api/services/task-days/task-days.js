import mongooseService from 'feathers-mongoose';
import Model from './model';
import { setChildModelProperty, searchQuery } from '../hooks';
import auth from '../hooks/auth';
import { createForeman } from './hooks';

export default function() {
  const app = this;

  app.use('/task-days', mongooseService({
    Model: Model,
    paginate: {
      default: 10
    }
  }));

  const service = app.service('/task-days');

  const setCompletedOnTask = {
    parentProp: 'completed',
    parentService: '/task-days',
    childProp: 'completed',
    childService: '/tasks',
    childRef: 'completedTasks'
  };

  const removeCompletedOnTask = Object.assign({}, setCompletedOnTask, {
    parentProp: null
  });

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery({
        "job": "/jobs",
        "foreman": "/foremen"
      })
    ],
    create: [
      createForeman()
    ],
    update: [
      setChildModelProperty(removeCompletedOnTask)
    ],
    patch: [
      setChildModelProperty(removeCompletedOnTask)
    ]
  });
  service.after({
    create: [
      setChildModelProperty(setCompletedOnTask)
    ],
    update: [
      setChildModelProperty(setCompletedOnTask)
    ],
    patch: [
      setChildModelProperty(setCompletedOnTask)
    ],
    remove: [
      setChildModelProperty(removeCompletedOnTask)
    ]
  });
}
