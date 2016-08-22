import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';
import TaskDay from 'job-tracker/models/task-day/';

export const Report = TaskDay.extend({});

Report.List = can.List.extend({
  Map: Report
}, {});

export const reportConnection = superMap({
  url: {
  	getListData: 'GET /api/reports'
  },
  idProp: 'id',
  Map: Report,
  List: Report.List,
  name: 'report'
});

tag('report-model', reportConnection);

export default Report;
