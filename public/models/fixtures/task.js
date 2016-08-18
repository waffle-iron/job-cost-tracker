import fixture from 'can-fixture';

const store = fixture.store([
  {
    "updatedAt": "2016-01-19T05:22:17.573Z",
    "createdAt": "2016-01-14T18:27:56.000Z",
    "name": "Driveway",
    "notes": "Arbitrary notes",
    "__v": 0,
    "completed": null,
    "tons": 122,
    "cubicYards": 120,
    "hours": 329,
    "id": "5697e8ac661bf398950ec213"
  },
  {
    "updatedAt": "2016-01-19T05:10:59.620Z",
    "createdAt": "2016-01-15T18:13:27.000Z",
    "name": "bunker",
    "__v": 0,
    "completed": null,
    "tons": 0,
    "cubicYards": 0,
    "hours": 0,
    "id": "569936c7c0bb7df8ba4f29b0"
  },
  {
    "updatedAt": "2016-01-19T05:22:17.573Z",
    "createdAt": "2016-01-19T04:38:51.000Z",
    "name": "flooring",
    "__v": 0,
    "completed": null,
    "tons": 0,
    "cubicYards": 0,
    "hours": 0,
    "id": "569dbddb29c507f9037953c6"
  },
  {
    "updatedAt": "2016-01-20T23:08:11.380Z",
    "createdAt": "2016-01-20T22:52:51.000Z",
    "name": "flooring",
    "completed": "2016-01-18T00:00:00.000Z",
    "__v": 0,
    "tons": 23,
    "cubicYards": 120,
    "hours": 178,
    "id": "56a00fc3e977a1e649ffac3d"
  },
  {
    "updatedAt": "2016-01-20T23:08:11.380Z",
    "createdAt": "2016-01-20T22:54:33.000Z",
    "name": "driveway",
    "completed": "2016-01-18T00:00:00.000Z",
    "__v": 0,
    "tons": 23,
    "cubicYards": 120,
    "hours": 178,
    "id": "56a01029e977a1e649ffac3e"
  },
  {
    "updatedAt": "2016-01-20T23:08:11.380Z",
    "createdAt": "2016-01-20T22:54:33.000Z",
    "name": "basement",
    "__v": 0,
    "completed": "2016-01-18T00:00:00.000Z",
    "tons": 68,
    "cubicYards": 78,
    "hours": 120,
    "id": "56a01029e977a1e649ffac3f"
  },
  {
    "updatedAt": "2016-01-20T23:07:54.157Z",
    "createdAt": "2016-01-20T23:00:37.000Z",
    "name": "garage pad",
    "__v": 0,
    "completed": "2016-01-16T00:00:00.000Z",
    "tons": 312,
    "cubicYards": 190,
    "hours": 832,
    "id": "56a01195e977a1e649ffac43"
  },
  {
    "updatedAt": "2016-01-20T23:07:35.369Z",
    "createdAt": "2016-01-20T23:00:37.000Z",
    "name": "patio",
    "__v": 0,
    "completed": "2016-01-17T00:00:00.000Z",
    "tons": 43,
    "cubicYards": 21,
    "hours": 165,
    "id": "56a01195e977a1e649ffac44"
  },
  {
    "updatedAt": "2016-01-20T23:07:35.369Z",
    "createdAt": "2016-01-20T23:00:37.000Z",
    "name": "exposed aggregate",
    "__v": 0,
    "completed": "2016-01-17T00:00:00.000Z",
    "tons": 0,
    "cubicYards": 0,
    "hours": 100,
    "id": "56a01195e977a1e649ffac45"
  }
]);

fixture({
  'GET /tasks': store.findAll,
  'GET /tasks/{_id}': store.findOne,
  'POST /tasks': store.create,
  'PUT /tasks/{_id}': store.update,
  'DELETE /tasks/{_id}': store.destroy
});

export default store;
