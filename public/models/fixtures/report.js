import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}]);

fixture({
  'GET /api/reports': store.findAll,
  'GET /api/reports/{id}': store.findOne,
  'POST /api/reports': store.create,
  'PUT /api/reports/{id}': store.update,
  'DELETE /api/reports/{id}': store.destroy
});

export default store;
