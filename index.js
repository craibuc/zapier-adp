const authentication = require('./authentication');
// const getListStatesTrigger = require('./triggers/get_list_states.js');
// const hireWorkerCreate = require('./creates/hire_worker.js');
const findWorkerSearch = require('./searches/find_worker.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  // creates: { [hireWorkerCreate.key]: hireWorkerCreate },
  // triggers: { [getListStatesTrigger.key]: getListStatesTrigger },
  searches: { [findWorkerSearch.key]: findWorkerSearch },
};
