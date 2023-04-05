const authentication = require('./authentication');

// const hireWorkerCreate = require('./creates/hire_worker.js');

const findWorkerSearch = require('./searches/find_worker.js');

// const getListStatesTrigger = require('./triggers/get_list_states.js');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  beforeRequest: [],
  afterResponse: [],

  resources: {},

  // creates: { [hireWorkerCreate.key]: hireWorkerCreate },
  searches: { [findWorkerSearch.key]: findWorkerSearch },
  // triggers: { [getListStatesTrigger.key]: getListStatesTrigger },
};

module.exports = App;