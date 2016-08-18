import mongooseService from 'feathers-mongoose';
import Model from './model.js';
import { addToLot } from './hooks';
import { searchQuery } from '../hooks';
import auth from '../hooks/auth';

export default function() {
  const app = this;

  app.use('/tasks', mongooseService({
    Model: Model,
    paginate: {
      default: 10
    }
  }));

  const service = app.service('/tasks');

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery({
        "job": "/jobs",
        "lot": "/lots"
      })
    ]
  });
  service.after({
    create: [
      addToLot()
    ]
  });
}
