import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const Foreman = can.Map.extend({
  define: {
  	name: {
  		type: 'string'
  	}
  }
});

Foreman.List = can.List.extend({
  Map: Foreman
}, {});

export const foremanConnection = superMap({
  url: {
    getListData: function(req){
      var data = '';
      if(req.search){
        req['$search'] = {
          'name': req.search
        };
      }

      delete req.search;

      return can.ajax({
        url: '/api/foremen',
        method: 'GET',
        data: req
      });
    },
    getData: 'GET /api/foremen/{id}',
    createData: 'POST /api/foremen',
    updateData: 'PUT /api/foremen/{id}',
    destroyData: 'DELETE /api/foremen/{id}'
  },
  idProp: 'id',
  Map: Foreman,
  List: Foreman.List,
  name: 'foreman'
});

tag('foreman-model', foremanConnection);

export default Foreman;
