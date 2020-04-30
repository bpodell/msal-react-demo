import { UserAgentApplication } from "msal";

const msalConfig = {
    auth: {
        tenant: 'navigatorcre.onmicrosoft.com',
        clientId: '366be840-dd34-4fee-8650-3acc60eb6d7d',
        signInFlow: 'B2C_1_SuSi',
        forgotPasswordFlow: 'B2C_1_FP',
        redirectUri: 'http://localhost:3000/callback',
        b2cscopes: ['user.read'],
        authority: 'https://navigatorcre.b2clogin.com/tfp/navigatorcre.onmicrosoft.com/B2C_1_SuSi/v2.0',
        validateAuthority: false
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };

  // Add here scopes for id token to be used at MS Identity Platform endpoints.
  const loginRequest = {
    scopes: ['openid'],
    // authority: 'https://navigatorcre.b2clogin.com/tfp/navigatorcre.onmicrosoft.com/B2C_1_SuSi/v2.0'
  };

  // Add here scopes for access token to be used at MS Graph API endpoints.
  const tokenRequest = {
    scopes: ["Mail.Read"]
  };

const msalApp = new UserAgentApplication(msalConfig);

export default msalApp;