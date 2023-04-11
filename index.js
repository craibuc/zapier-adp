const authentication = require('./authentication');

// const rehireWorkerCreate = require('./creates/rehire_worker.js');

const findWorkerSearch = require('./searches/find_worker.js');

// const getListStatesTrigger = require('./triggers/get_list_states.js');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  beforeRequest: [],
  afterResponse: [],

  resources: {},

  // creates: { [rehireWorkerCreate.key]: rehireWorkerCreate },
  searches: { [findWorkerSearch.key]: findWorkerSearch },
  // triggers: { [getListStatesTrigger.key]: getListStatesTrigger },
};

module.exports = App;