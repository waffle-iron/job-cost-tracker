import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const Lot = can.Map.extend({
  define: {
    lotNumber: { type: 'string' },
    jobId: { type: 'number' },
    name: { type: 'string' }
  }
});

Lot.List = can.List.extend({
  Map: Lot
}, {});

export const lotConnection = superMap({
  url: {
    getListData: function(req){
      var data = '';
      if(req.search){
        req['$search'] = {
          'lotNumber': req.search
        };
      }
      if(!req['$sort']){
        req["$sort"] = {
          lotNumber: 1
        }
      }

      delete req.search;

      return can.ajax({
        url: "/api/lots?$populate[]=tasks",
        method: "GET",
        data: req
      });
    },
    getData: "GET /api/lots/{id}",
    createData: "POST /api/lots",
    updateData: "PUT /api/lots/{id}",
    destroyData: "DELETE /api/lots/{id}"
  },
  Map: Lot,
  List: Lot.List,
  name: 'lot'
});

tag('lot-model', lotConnection);

export default Lot;
