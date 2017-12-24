import jwt from 'jsonwebtoken';
import fs from 'fs';
import Promise from 'bluebird';
import * as admin from 'firebase-admin';
import settings from '../config/settings.json';
import utils from '../src/lib/utils';
import api from '../src/lib/server';
const key = fs.readFileSync(settings.jwtKey);
const serviceAccount = (settings.firebase.key) ? require(settings.firebase.key) : null;
const prefix = '/api/auth';

const loginPayload = (results, cb) => {
  if (results) {
    jwt.sign(
      results.user,
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

const getName = (token) => {
  const payload = {
    firstName: null,
    lastName: null,
  };
  if (token.user) {
    payload.firstName = token.additionalUserInfo.profile.given_name;
    payload.lastName = token.additionalUserInfo.profile.family_name;
  } else {
    const name = token.displayName.split(' ');
    payload.firstName = name[0];
    payload.lastName = name[name.length - 1];
  }
  return payload;
};

const getGoogleLogin = (token) => {
  const uid = (token.user) ? token.user.uid : token.uid;
  const { firstName, lastName } = getName(token);
  return api.thirdPartyLogins.search(
    'google',
    uid,
    firstName,
    lastName,
  );
};


const thirdPartyLogin = (request, reply) => {
  console.log(request.payload);
  const type = request.payload.type;
  const token = request.payload.token;
  const uid = (token.user) ? token.user.uid : token.uid;
  let result = {
    user: null,
    person: null,
  };
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
          result = Object.assign(
            {},
            result,
            {
              user: {
                peopleId: results.id,
                uid,
                entityId: results.entityId,
                type: 'google',
              },
              person: results,
            }
          );
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
    )
    .catch(
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
