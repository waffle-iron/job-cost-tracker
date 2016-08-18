import mongoose from 'mongoose';
import config from '../config';
//app services
import foremanService from './foremen/foremen';
import jobService from './jobs/jobs';
import taskService from './tasks/tasks';
import lotService from './lots/lots';
import taskDayService from './task-days/task-days';
import reportsService from './reports/reports';
import usersService from './users/users';

mongoose.Promise = global.Promise;
mongoose.connect(config.connections.mongodb.connectionString);

export default function() {
  const app = this;

  return app
    .configure(usersService)
    .configure(foremanService)
    .configure(jobService)
    .configure(taskService)
    .configure(lotService)
    .configure(taskDayService)
    .configure(reportsService);
}
