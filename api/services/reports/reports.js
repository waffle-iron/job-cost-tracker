import mongoose from 'mongoose';
import taskDay from '../task-days/model';
import Job from '../jobs/model';
import Foreman from '../foremen/model';
import Task from '../tasks/model';
import moment from 'moment';
import isObject from 'lodash/lang/isObject';
import { searchQuery } from '../hooks';
import auth from '../hooks/auth';

const ObjectId = mongoose.Types.ObjectId;

function dateFromString(dateString) {
  return moment.utc(dateString, 'MM/DD/YYYY').startOf('day').toDate();
}

export default function() {
  const app = this;

  app.use('/reports', {
    find(params, callback) {
      let query = params.query || {};
      let { startdate, enddate, foreman, job } = query;
      if (startdate || enddate) {
        query.completed = {};
        if (startdate) {
          query.completed['$gte'] = dateFromString(startdate);
          delete query.startdate;
        }
        if (enddate) {
          query.completed['$lte'] = dateFromString(enddate);
          delete query.enddate;
        }
      }

      if (foreman) {
        if (typeof foreman === 'string') {
          query.foreman = ObjectId(foreman);
        } else if (isObject(foreman)) {
          query.foreman.$in = query.foreman.$in.map(foreman => ObjectId(foreman));
        }
      }

      if (job) {
        if (typeof job === 'string') {
          query.job = ObjectId(job);
        } else if (isObject(job)) {
          query.job.$in = query.job.$in.map(job => ObjectId(job));
        }
      }

      taskDay.aggregate({ $match: query })
        .group({
          _id: "$job",
          tons: { $sum: "$tons" },
          hours: { $sum: "$hours" },
          cubicYards: { $sum: "$cubicYards" },
          completedTasks: { $addToSet: '$completedTasks' },
          foremen: { $addToSet: '$foreman' }
        })
        .project({
          job:"$_id",
          _id: false,
          tons: true,
          hours: true,
          cubicYards: true,
          completedTasks: true,
          foremen: true
        })
        .unwind('completedTasks')
        .unwind('completedTasks')
        .unwind('foremen')
        .group({
          _id: '$job',
          tons: { $first: "$tons" },
          hours: { $first: "$hours" },
          cubicYards: { $first: "$cubicYards" },
          completedTasks: { $addToSet: '$completedTasks' },
          foremen: { $addToSet: '$foremen' }
        })
        .project({
          job:"$_id",
          _id: false,
          tons: true,
          hours: true,
          cubicYards: true,
          completedTasks: true,
          foremen: true
        })
        .exec((err, results) => {
          if (err) {
            return callback(err);
          }
          Job.populate(results, {path: "job"})
          .then((results) => Foreman.populate(results, {path:'foremen', select: 'name'}))
          .then(results => {
            let allocations = results.map(report => {
              let allocs = Task.aggregate({ $match: { _id: { $in: report.completedTasks } } })
                .group({
                  _id:null,
                  allocatedTons: { $sum: "$tons" },
                  allocatedHours: { $sum: "$hours" },
                  allocatedCubicYards: { $sum: "$cubicYards" }
                })
                .project({
                  _id:false,
                  allocatedTons: true,
                  allocatedHours: true,
                  allocatedCubicYards: true
                })
                .exec();
              return allocs.then(alloc => {
                return alloc[0]; // extract the aggregates from the list
              });
            });
            return Promise.all(allocations)
              .then(allocations => {
                results.forEach((report, i) => {
                  Object.assign(report, allocations[i]);
                });
                return results;
              });
          })
          .then((results) => Task.populate(results, { path:'completedTasks' }))
          .then((results) => results.map(report => {
            let start = startdate ? '-'+startdate : '';
            let end = '-' + (enddate || moment.utc().startOf('day').format('MM-DD-YYYY'));
            report._id = `${report.job.id}${start}${end}`;
            return report;
          }))
          .then(r => {
            callback(null, r);
          })
          .catch((err) => {
            return callback(err);
          });
        });
      }

  });

  const service = app.service('/reports');

  service.before({
    all: [
      auth({ role: "admin" }),
      searchQuery({
        "job": "/jobs",
        "foreman": "/foremen"
      })
    ]
  });

}
