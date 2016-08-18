import escapeRegExp from 'lodash/string/escapeRegExp';
import map from 'lodash/collection/map';
import flatten from 'lodash/array/flatten';
import defaults from 'lodash/object/defaults';
import forOwn from 'lodash/object/forOwn';
import mapValues from 'lodash/object/mapValues';
import isObject from 'lodash/lang/isObject';

function mapValuesToRegExs(searchObj) {
  return mapValues(searchObj, (val, key) => {
    return new RegExp(escapeRegExp(val), 'i');
  });
}

function includeSearchedConnectedResources(search, options, hook) {
  let connectedResourceRequests = flatten(map(options, (serviceId, resourceName) => {
    let resourceLead = new RegExp('^' + resourceName + '(\.|$)', 'i');
    return Object.keys(search)
      .filter((key) => resourceLead.test(key))
      .map(key => {
        let searchKey = search[key];
        delete search[key];
        return {
          serviceQuery: {
            [key.replace(resourceName + '.', '')]: searchKey,
            '$select': ['id']
          },
          service: serviceId,
          property: resourceName
        };
      })
      .map(config => {
        return Promise.resolve(config)
          .then(config => {
            return hook.app.service(config.service).find({
                query: config.serviceQuery
              }, hook.params)
              .then(results => {
                config.results = results;
                return config;
              });
          });
      });
  }));

  return Promise.all(connectedResourceRequests).then(resourceReqs => {

    var newMap = resourceReqs
      .map(req => {
        return {
          key: req.property,
          ids: req.results.map((model) => model.id)
        };
      })
      .reduce((acc, val, idx) => {
        return Object.assign(acc, {
          [val.key]: {
            $in: val.ids
          }
        });
      }, {});
    Object.assign(search, newMap);
    return search;
  });
}

function modifyQuery(query, options, hook) {
  let resolveQuery = Promise.resolve(query);
  if (isObject(query.$search)) {

    resolveQuery = resolveQuery.then(query => {
      query.$search = mapValuesToRegExs(query.$search);
      return query;
    });

    if (options) {
      resolveQuery = resolveQuery.then(query => {
        return includeSearchedConnectedResources(query.$search, options, hook)
          .then(search => {
            query.$search = search;
            return query;
          });
      });
    }

    return resolveQuery.then(query => {
      defaults(query, query.$search);
      return query;
    });
  }
  return resolveQuery;
}

export function searchQuery(options) {
  return function searchQueryHook(hook) {
    let resolveHook = Promise.resolve(hook);
    let query = hook.params.query;
    if (query && '$search' in query) {
      return resolveHook.then(hook => {
        return modifyQuery(query, options, hook)
          .then(query => {
            delete query.$search;
            // hook.params.query = query; // unnessecary
            return hook;
          })
          .catch(err => {
            console.error(err); // eslint-disable-line no-console
            throw err;
          });
      });
    }
    return resolveHook;
  };
}

export default searchQuery;
