import utils from '../src/lib/utils';
import api from '../src/lib/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Promise from 'bluebird';
import settings from '../config/settings.json';
const key = fs.readFileSync(settings.jwtKey);
const prefix = '/api/auth';

const loginPayload = (results, cb) => {
  if (results) {
    jwt.sign(
      {
        peopleId: results.user.peopleId,
        entityId: results.user.entityId,
      },
      key,
      {
        expiresIn: '7d',
        issuer: 'evangelizeIo',
        algorithm: 'RS256',
      },
      (err, token) => {
        const payload = {
          user: results,
          jwt: token,
        };
        cb(payload);
      }
    );
  } else {
    cb();
  }
};

const sendResponse = (reply, payload, state, code) => {
  if (state) {
    reply(payload).state(state.type, state.payload).code(code);
  } else {
    reply(payload).code(code);
  }
};

const login = (request, reply) => {
  console.log(request.payload);
  const email = request.payload.email || request.payload.username;
  utils
  .getPeoplePassword(email)
  .then(
    (results) => {
      console.log(results);
      loginPayload(
        results,
        (payload) => {
          if (payload) {
            sendResponse(reply, payload, null, 200);
          } else {
            const state = {
              type: 'data',
              payload: {
                firstVisit: false,
              },
            };
            sendResponse(reply, results, state, 401);
          }
        }
      );
    },
    (err) => {
      console.log(err);
      sendResponse(reply, err, null, 401);
    }
  );
};


const getGoogleLogin = (token) => {
  const id = token.profileObj.googleId;
  return new Promise((resolve, reject) => {
    api.thirdPartyLogins.search(
      'google',
      id,
      token.profileObj.givenName,
      token.profileObj.familyName,
    )
    .then(
      (results) => {
        return resolve(results);
      },
      (err) => reject(err)
    );
  });
};

const thirdPartyLogin = (request, reply) => {
  console.log(request.payload);
  const type = request.payload.type;
  const token = request.payload.token;
  if (type === 'google') {
    getGoogleLogin(token)
    .then(
      (results) => {
        console.log(results);
        if (results && request.payload.username) {
          const user = results;
          user.username = `${user.firstName} ${user.lastName}`;
          sendResponse(reply, user, null, 200);
        } else {
          const result = {
            user: {
              peopleId: results.id,
              externalId: token.profileObj.googleId,
              entityId: results.entityId,
              type: 'google',
            },
            person: results,
          }
          loginPayload(
            result,
            (payload) => {
              if (payload) {
                sendResponse(reply, payload, null, 200);
              } else {
                const state = {
                  type: 'data',
                  payload: { firstVisit: false },
                };
                sendResponse(reply, results, state, 401);
              }
            }
          );
        }
      },
      (err) => {
        console.log(err);
        sendResponse(reply, err, null, 401);
      }
    );
  }
};

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/login`,
    handler: login,
  },
  {
    method: 'POST',
    path: `${prefix}/thirdPartyLogin`,
    handler: thirdPartyLogin,
  },
  {
    method: 'POST',
    path: '/v2/users/login',
    handler: login,
  },
];
