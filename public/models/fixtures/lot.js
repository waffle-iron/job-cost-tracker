import fixture from 'can-fixture';

const store = fixture.store([
  {
    "id": "56a011c8e977a1e649ffac48",
    "lotNumber": 1213,
    "name": "The big one"
  },
  {
    "id": "56a011c8e977a1e649ffac47",
    "lotNumber": 1214
  },
  {
    "id": "56a011c8e977a1e649ffac46",
    "lotNumber": 1215,
    "name": "House on Haunted Hill"
  },
  {
    "id": "56a00f46e977a1e649ffac3c",
    "lotNumber": 2345
  },
  {
    "id": "56a00f46e977a1e649ffac3b",
    "lotNumber": 4678
  }
]);

fixture({
  'GET /api/lot': function(req, handler){
    var resp = store.findAll(req);

    if(req.data.search){
      var filtered = resp.data.filter(function(item){
        var search = can.trim(req.data.search);
        return ((item.lotNumber + "").indexOf(search)===0) ||
                (item.name && item.name.toLowerCase().indexOf(search.toLowerCase())!==-1);
      });
      resp = {
        count: filtered.length,
        data: filtered
      };
    }
    return resp;
  },
  'GET /api/lots/{id}': store.findOne,
  'POST /api/lots': store.create,
  'PUT /api/lots/{id}': store.update,
  'DELETE /api/lots/{id}': store.destroy
});

export default store;
