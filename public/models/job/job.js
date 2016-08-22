import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';
import Lot from 'job-tracker/models/lot/';

export const Job = can.Map.extend({
  define: {
    name: { type: 'string' },
    lots: { 
    	Type: Lot.List,
    	value: []
    }
  }
});

Job.List = can.List.extend({
  Map: Job
}, {});

export const jobConnection = superMap({
  url: {
    getListData: function(req){
      var data = '';
      if(req && req.search){
        req['$search'] = {
          'name': req.search
        };
      }
      if(!req['$sort']){
        req["$sort"] = {
          name: 1
        }
      }

      delete req['search'];

      return can.ajax({
        url: "/api/jobs?$populate[]=lots",
        method: "GET",
        data: req
      });
    },
    getData: "GET /api/jobs/{id}?$populate[]=lots",
    createData: function(job){
      return can.ajax({
        processData: false,
        url: "/api/jobs",
        method: "POST",
        data: JSON.stringify(job),
        contentType: 'application/json'
      });
    },
    updateData: function(job){
      return can.ajax({
        processData: false,
        url: "/api/jobs/" + job.id,
        method: "PUT",
        data: JSON.stringify(job),
        contentType: 'application/json'
      });
    },
    destroyData: "DELETE /api/jobs/{id}"
  },
  Map: Job,
  List: Job.List,
  name: 'job'
});

tag('job-model', jobConnection);

export default Job;
