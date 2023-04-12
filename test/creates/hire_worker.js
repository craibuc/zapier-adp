/*
.Example
npm test -- hire_worker.test.js

run the tests in this file.

.Example
nvm exec v18 npm test -- hire_worker.test.js

run the tests in this file using nvm (node version manager)
*/

const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates/hire_worker', () => {

  // arrange
  const bundle = {
    authData: {
      certificate: process.env.ADP_CERTIFICATE,
      private_key: process.env.ADP_PRIVATE_KEY,
      sessionKey: process.env.ADP_ACCESS_TOKEN
    },

    inputData: {
      givenName: 'Donald',
      familyName: 'Duck',
      birthDate: '2005-01-01',
      genderCode: 'M',
      ssn: '123-45-6789',
      lineOne: '1000 Main Street',
      lineTwo: '#1',
      cityName: 'Minneapolis',
      stateCode: 'MN',
      postalCode: '55555',
      hireDate: new Date().toISOString().split('T')[0],
      payrollGroupCode: 'ABC'
    },
  };

  describe("when a worker doesn't exist", () => {

    it('creates a worker', async () => {

      // const bundle = { inputData: {} };
  
      const results = await appTester(
        App.creates['hire_worker'].operation.perform, 
        bundle
      );
  
      expect(results).toBeDefined();
  
    });
  
  });

  describe("when a worker exists", () => {

    it('throws an error', async () => {

      // const bundle = { inputData: {} };
  
      // act/assert
      await expect(appTester(
        App.creates['hire_worker'].operation.perform,
        bundle
      )).rejects.toThrow();

    });
  
  });

});
