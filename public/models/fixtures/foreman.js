import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  name: 'Solomon Grundy'
}, {
  id: 1,
  name: 'Ichabod Crane'
}]);

fixture({
  'GET /foremen': store.findAll,
  'GET /foremen/{id}': store.findOne,
  'POST /foremen': store.create,
  'PUT /foremen/{id}': store.update,
  'DELETE /foremen/{id}': store.destroy
});

export default store;
