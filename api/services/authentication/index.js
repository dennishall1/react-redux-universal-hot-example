import hooks from 'feathers-hooks';
import {
  TokenService as tokenService,
  LocalService as localService,
  OAuth2Service as oauth2Service
} from 'feathers-authentication';
import authMiddleware from 'feathers-authentication/lib/middleware';

function addTokenExpiration() {
  return hook => {
    if (hook.result.token) {
      hook.result.expires = hook.app.get('auth').cookies['feathers-session'].maxAge || null;
    }
    return hook;
  };
}

function restToSocketAuth() {
  return hook => {
    if (hook.params.provider !== 'rest') return hook;
    const { token, user } = hook.result;
    const { socketId } = hook.data;
    if (socketId && hook.app.io && token) {
      const userSocket = Object.values(hook.app.io.sockets.connected).find(socket => socket.client.id === socketId);
      userSocket.feathers.token = token;
      userSocket.feathers.user = user;
    }
    return hook;
  };
}

export socketAuth from './socketAuth';

export default function authenticationService() {
  const app = this;

  const config = app.get('auth');

  const { exposeRequestResponse, tokenParser, decodeToken, populateUser, logout } = authMiddleware;

  const middleware = [
    exposeRequestResponse(config),
    tokenParser(config),
    decodeToken(config),
    populateUser(config),
    logout(config)
  ];

  app.use(middleware)
    .configure(tokenService())
    .configure(localService())
    .configure(oauth2Service(config.facebook));


  app.service('auth/local')
    .after({
      create: [
        hooks.remove('user.password'),
        addTokenExpiration(),
        restToSocketAuth()
      ]
    });

  app.service('auth/facebook')
    .after({
      create: [
        // TODO: cf src/containers/Login/Login.js l25 (and stop use facebook email)
        /* hook => { // Share the facebook email if the user email does not exist
          const { email, facebook } = hook.result.user;
          if (facebook && facebook.email && !email) {
            hook.result.user.email = facebook.email;
            return hook;
          }
        }, */
        addTokenExpiration(),
        restToSocketAuth()
      ]
    });
}
