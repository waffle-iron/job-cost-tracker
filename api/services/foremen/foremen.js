import mongooseService from 'feathers-mongoose';
import Model from './model';
import { searchQuery } from '../hooks';
import auth from '../hooks/auth';

export default function() {
  const app = this;

  app.use('/foremen', mongooseService({
    Model
  }));

  const service = app.service('/foremen');

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery()
    ]
  });
}
