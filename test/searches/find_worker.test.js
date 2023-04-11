/*
.Example
npm test -- find_worker.test.js

run the tests in this file.

.Example
nvm exec v18 npm test -- find_worker.test.js 

run the tests in this file using nvm (node version manager)
*/

const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

// load .env
zapier.tools.env.inject();

describe('searches/find_worker', () => {

  // arrange
  let bundle = {
    authData: {
      certificate: process.env.ADP_CERTIFICATE,
      private_key: process.env.ADP_PRIVATE_KEY,
      sessionKey: process.env.ADP_ACCESS_TOKEN,
    },
    inputData: {},
  };

  describe('when a valid SSN is supplied', () => {

    it('returns a worker', async () => {

      // arrange
      bundle.inputData.ssn = process.env.VALID_WORKER_SSN

      // act
      const results = await appTester(
          App.searches['find_worker'].operation.perform,
          bundle
      );
  
      // assert
      expect(results).toHaveLength(1);
      expect(results[0].person.governmentIDs[0].idValue).toBe(bundle.inputData.ssn);

    });

  });

  describe('when an invalid SSN is supplied', () => {

    it('returns an empty object', async () => {

      // arrange
      bundle.inputData.ssn = '123-45-6789å'

      // act
      const results = await appTester(
          App.searches['find_worker'].operation.perform,
          bundle
      );
  
      // assert
      expect(results).toHaveLength(0);

    });

  });

});
