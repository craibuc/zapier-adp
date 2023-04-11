/*
.Example
npm test -- rehire_worker.test.js

run the tests in this file.

.Example
nvm exec v18 npm test -- rehire_worker.test.js

run the tests in this file using nvm (node version manager)
*/

const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

// load .env
zapier.tools.env.inject();

describe('creates/rehire_worker', () => {
  
  // arrange
  const bundle = {
    authData: {
      certificate: process.env.ADP_CERTIFICATE,
      private_key: process.env.ADP_PRIVATE_KEY,
      sessionKey: process.env.ADP_ACCESS_TOKEN
    },

    inputData: {
      associateOID: 'G3BJDMRVTTP9GTMX',
      rehireDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      reasonCode: 'IMPORT'
    },
  };

  describe('when a worker exists', () => {

    describe('and is not active', () => {

      it('creates a work-assignment', async () => {
  
        // act
        const result = await appTester(
          App.creates['rehire_worker'].operation.perform,
          bundle
        );
    
        // assert
        expect(result).not.toBeNull();
    
      });
    
    });

    describe('and is active', () => {

      it('raises an exception', async () => {

        await expect(appTester(
          App.creates['rehire_worker'].operation.perform,
          bundle
        )).rejects.toThrow();

      });
  
    });
  
  });

  describe('when a worker does not exist', () => {

    it('raises an exception', async () => {

      // arrange
      bundle.inputData.associateOID = 'ABCDEFGHIJ'

      // act/assert
      await expect(appTester(
        App.creates['rehire_worker'].operation.perform,
        bundle
      )).rejects.toThrow();

    });

  });

});
