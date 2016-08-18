import mongooseService from 'feathers-mongoose';
import Model from './model';
import { setChildModelProperty, searchQuery } from '../hooks';
import auth from '../hooks/auth';
import { createLots } from './hooks';

export default function() {
  const app = this;

  app.use('/jobs', mongooseService({
    Model
  }));

  const service = app.service('/jobs');

  const setJobOnLots = {
    parentProp: '_id',
    parentService: '/jobs',
    childProp: 'job',
    childService: '/lots',
    childRef: 'lots'
  };

  const removeJobOnLots = Object.assign({}, setJobOnLots, { parentProp: null });

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery()
    ],
    create: [
      createLots()
    ],
    update: [
      createLots(),
      setChildModelProperty(removeJobOnLots)
    ],
    patch: [
      setChildModelProperty(removeJobOnLots)
    ]
  });

  service.after({
    create: [
      setChildModelProperty(setJobOnLots)
    ],
    update: [
      setChildModelProperty(setJobOnLots)
    ],
    patch: [
      setChildModelProperty(setJobOnLots)
    ],
    remove: [
      setChildModelProperty(removeJobOnLots)
    ]
  });
}
