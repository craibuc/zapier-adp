/*
.Example
npm test -- terminate_worker.test.js

run the tests in this file.

.Example
nvm exec v18 npm test -- terminate_worker.test.js

run the tests in this file using nvm (node version manager)
*/

const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

// load .env
zapier.tools.env.inject();

describe('creates/terminate_worker', () => {
  
  // arrange
  const bundle = {
    authData: {
      certificate: process.env.ADP_CERTIFICATE,
      private_key: process.env.ADP_PRIVATE_KEY,
      sessionKey: process.env.ADP_ACCESS_TOKEN
    },

    inputData: {
      workAssignmentID: process.env.VALID_POSITION_ID, 
      comments: 'Aut architecto deserunt delectus enim ut rerum repudiandae. Odit quaerat dolores quas aut dolores. Et et aperiam quia sed minima enim.', 
      terminationDate: new Date().toISOString().split('T')[0], 
      reasonCode: 'C'
    },
  };

  describe('when a worker exists', () => {

    describe('and is active', () => {

      it('terminates the worker', async () => {
  
        // act
        const result = await appTester(
          App.creates['terminate_worker'].operation.perform,
          bundle
        );
    
        // assert
        expect(result).not.toBeNull();
    
      });
    
    });

    describe('and is inactive', () => {

      it('raises an exception', async () => {

        await expect(appTester(
          App.creates['terminate_worker'].operation.perform,
          bundle
        )).rejects.toThrow();

      });
  
    });
  
  });

  // describe('when a worker does not exist', () => {

  //   it('raises an exception', async () => {

  //     // arrange
  //     bundle.inputData.associateOID = 'ABCDEFGHIJ'

  //     // act/assert
  //     await expect(appTester(
  //       App.creates['rehire_worker'].operation.perform,
  //       bundle
  //     )).rejects.toThrow();

  //   });

  // });

});
