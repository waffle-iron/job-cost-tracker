import fixture from 'can-fixture';

const store = fixture.store([
  {
    "updatedAt": "2016-01-20T23:08:11.378Z",
    "createdAt": "2016-01-19T04:58:09.000Z",
    "job": {
      "name": "Silverwood Heights",
      "id": "569e9089359f5bd31cd9b1eb"
    },
    "hours": 333,
    "cubicYards": 444,
    "tons": 555,
    "notes": "Some notes for the NEW day",
    "completed": "2016-01-18T00:00:00.000Z",
    "foreman": {
      "id": "56971d8a97046a3b78b33f54",
      "name": "Elwood P. Dowd"
    },
    "__v": 0,
    "completedTasks": [
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
        "createdAt": "2016-01-20T22:52:51.000Z",
        "name": "flooring",
        "completed": "2016-01-18T00:00:00.000Z",
        "__v": 0,
        "tons": 23,
        "cubicYards": 120,
        "hours": 178,
        "id": "56a00fc3e977a1e649ffac3d"
      }
    ],
    "id": "569dc261d3df7fa704177307"
  },
  {
    "updatedAt": "2016-01-20T23:07:54.154Z",
    "createdAt": "2016-01-19T08:59:03.000Z",
    "job": {
      "name": "Silverwood Heights",
      "id": "569e9089359f5bd31cd9b1eb"
    },
    "hours": 4567,
    "cubicYards": 4567,
    "tons": 4567,
    "notes": "Some notes for the other day",
    "completed": "2016-01-16T00:00:00.000Z",
    "foreman": {
      "id": "56971d8a97046a3b78b33f54",
      "name": "Switters"
    },
    "__v": 0,
    "completedTasks": [
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
        "updatedAt": "2016-01-20T23:08:11.380Z",
        "createdAt": "2016-01-20T22:52:51.000Z",
        "name": "flooring",
        "completed": "2016-01-18T00:00:00.000Z",
        "__v": 0,
        "tons": 23,
        "cubicYards": 120,
        "hours": 178,
        "id": "56a00fc3e977a1e649ffac3d"
      }
    ],
    "id": "569dfad732e8fd1510ae2ba9"
  },
  {
    "updatedAt": "2016-01-20T23:07:35.361Z",
    "createdAt": "2016-01-19T09:06:41.000Z",
    "job": {
      "id": "569e9089359f5bd31cd9b1eb",
      "name": "Silverwood Heights"
    },
    "hours": 4567,
    "cubicYards": 4567,
    "tons": 4567,
    "notes": "Some notes for the other day",
    "completed": "2016-01-17T00:00:00.000Z",
    "foreman": {
      "id": "56971d8a97046a3b78b33f54",
      "name": "Brave Sir Robin"
    },
    "__v": 0,
    "completedTasks": [
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
        "createdAt": "2016-01-20T22:52:51.000Z",
        "name": "flooring",
        "completed": "2016-01-18T00:00:00.000Z",
        "__v": 0,
        "tons": 23,
        "cubicYards": 120,
        "hours": 178,
        "id": "56a00fc3e977a1e649ffac3d"
      }
    ],
    "id": "569dfca1e0100ecf107538c6"
  }
]);

fixture({
  'GET api/task-days': store.findAll,
  'GET api/task-days/{id}': store.findOne,
  'POST api/task-days': store.create,
  'PUT api/task-days/{id}': store.update,
  'DELETE api/task-days/{id}': store.destroy
});

export default store;
