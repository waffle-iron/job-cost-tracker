import mongooseService from 'feathers-mongoose';
import Model from './model.js';
import { setChildModelProperty, searchQuery } from '../hooks';
import { createTasks } from './hooks';
import auth from '../hooks/auth';

export default function() {
  const app = this;

  app.use('/lots', mongooseService({
    Model: Model
  }));
  const service = app.service('/lots');

  const setChildPropConfig = {
    parentProp: '_id',
    parentService: '/lots',
    childProp: 'lot',
    childService: '/tasks',
    childRef: 'tasks'
  };

  const setLotOnTasks = Object.assign({}, setChildPropConfig);
  const removeLotOnTasks = Object.assign({}, setChildPropConfig, {parentProp: null});
  const setJobOnTasks = Object.assign({}, setChildPropConfig, {
    parentProp: 'job',
    childProp: 'job'
  });
  const removeJobOnTasks = Object.assign({}, setChildPropConfig, {
    parentProp: null,
    childProp: 'job'
  });

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery()
    ],
    create: [
      createTasks()
    ],
    update: [
      setChildModelProperty(removeLotOnTasks),
      setChildModelProperty(removeJobOnTasks)
    ],
    patch: [
      setChildModelProperty(removeLotOnTasks),
      setChildModelProperty(removeJobOnTasks)
    ]
  });

  service.after({
    create: [
      setChildModelProperty(setLotOnTasks),
      setChildModelProperty(setJobOnTasks)
    ],
    update: [
      setChildModelProperty(setLotOnTasks),
      setChildModelProperty(setJobOnTasks)
    ],
    patch: [
      setChildModelProperty(setLotOnTasks),
      setChildModelProperty(setJobOnTasks)
    ],
    remove: [
      setChildModelProperty(removeLotOnTasks),
      setChildModelProperty(removeJobOnTasks)
    ]
  });
}
