/*
.Example
npm test -- authentication.test.js

run the tests in this file.

.Example
nvm exec v16 npm test -- authentication.test.js

run the tests in this file using nvm (node version manager)
*/

const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

const crypto = require('crypto')

// load .env
zapier.tools.env.inject();

describe('authentication', () => {

  let bundle = null

  beforeEach(() => {

    // arrange
    bundle = {
      authData: {
        certificate: process.env.ADP_CERTIFICATE,
        private_key: process.env.ADP_PRIVATE_KEY,
        client_id: process.env.ADP_CLIENT_ID,
        client_secret: process.env.ADP_CLIENT_SECRET,
      },
      inputData: {},
    };

  });

  describe('getAccessToken', () => {

    describe('when valid credentials are supplied', () => {

      it('an access token is returned', async () => {
        
          // act
          const results = await appTester(
              App.authentication.sessionConfig.perform,
              bundle
          );
    
          // assert
          expect(bundle.authData.sessionKey).not.toBeNull();

        });
      
    });
  
    describe('when invalid credentials are supplied', () => {
  
      it('throws an error', async () => {

        // arrange
        bundle.authData.client_id = crypto.randomUUID()
        bundle.authData.client_secret = crypto.randomUUID()

        // act/assert
        await expect(appTester(
          App.authentication.sessionConfig.perform,
          bundle
        )).rejects.toThrow();
        // UnauthorizedError
      });
  
    });

    describe('when an invalid SSL certificate is supplied', () => {
  
      it('throws an error', async () => {

        // arrange
        bundle.authData.certificate = "-----BEGIN CERTIFICATE-----\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n-----END CERTIFICATE-----\n"

        // act/assert
        await expect(appTester(
          App.authentication.sessionConfig.perform,
          bundle
        )).rejects.toThrow();

      });
  
    });

    describe('when an invalid public key is supplied', () => {
  
      it('throws an error', async () => {

        // arrange
        bundle.authData.private_key = "-----BEGIN RSA PRIVATE KEY-----\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n-----END RSA PRIVATE KEY-----\n"

        // act/assert
        await expect(appTester(
          App.authentication.sessionConfig.perform,
          bundle
        )).rejects.toThrow();

      });
  
    });

  });

  describe('test', () => {
  
    describe('when a valid sessionKey is supplied', () => {

      it('returns meta data', async () => {
    
        // arrange
        bundle.authData.sessionKey = process.env.ADP_ACCESS_TOKEN

        // act
        const results = await appTester(
            App.authentication.test,
            bundle
        );
  
        // assert
        expect(results).not.toBeNull();
    
      });
  
    });

    describe('when an invalid sessionKey is supplied', () => {

      it('throws an error', async () => {

        // arrange
        bundle.authData.sessionKey = crypto.randomUUID()

        // act/assert
        await expect(appTester(
            App.authentication.test,
            bundle
        )).rejects.toThrow();

      });
  
    });

  });

});
