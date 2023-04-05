const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

// load .env
zapier.tools.env.inject();

describe('authentication', () => {

    // arrange
    let bundle = {
      authData: {
        certificate: process.env.ADP_CERTIFICATE,
        private_key: process.env.ADP_PRIVATE_KEY,
        client_id: process.env.ADP_CLIENT_ID,
        client_secret: process.env.ADP_CLIENT_SECRET,
      },
      inputData: {},
    };


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
        )).rejects.toThrow('The given client credentials were not valid [401]');

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

  describe('testAuthentication', () => {
  
    describe.skip('when a valid sessionKey is supplied', () => {

      it('returns data from /hr/v2/workers/meta', async () => {
    
        // arrange
        bundle.authData.sessionKey = process.env.ADP_PRIVATE_KEY

        // act
        const results = await appTester(
            App.authentication.test,
            bundle
        );
  
        // assert
        results.should.not.beNull();
    
      });
  
    });

    describe.skip('when an invalid sessionKey is supplied', () => {

      it('throws an error', async () => {

        // arrange
        bundle.authData.sessionKey = crypto.randomUUID()

        // mock
        // jest.spyOn(intacct.contacts, 'create_contact').mockImplementation(
        //   () => {
        //     throw new Error('Bad Request');
        //   }
        // )

        /*
        {
          "response": {
              "responseCode": 401,
              "methodCode": "GET",
              "resourceUri": {
                  "href": "/hr/v2/workers/meta"
              },
              "serverRequestDateTime": "2023-01-25T16:41:35.894Z",
              "applicationCode": {
                  "code": 401,
                  "typeCode": "error",
                  "message": "Unauthorized"
              },
              "client_ip_adddress": "72.50.209.210",
              "adp-correlationID": "87e78dca-290d-47dc-a474-673716b1b026"
            }
          } */

        // act/assert
        await expect(appTester(
            App.authentication.test,
            bundle
        )).rejects.toThrow('Unauthorized');

      });
  
    });

  });

});
