import jwt from 'jsonwebtoken';
import fs from 'fs';
import Promise from 'bluebird';
import * as admin from 'firebase-admin';
import settings from '../config';
import utils from '../src/lib/utils';
import api from '../src/lib/server';
const key = fs.readFileSync(settings.tokenKey.private);
const prefix = '/api/auth';

const loginPayload = (results, cb) => {
  let retVal;
  if (results) {
    retVal = {
      user: results,
      jwt: null,
    };
    retVal.jwt = jwt.sign(
      results.user,
      key,
      {
        expiresIn: '7d',
        issuer: 'evangelizeIo',
        algorithm: 'RS256',
      },
    );
  }

  return retVal;
};

const sendResponse = (h, payload, state, code) => {
  if (state) {
    // reply(payload).state(state.type, state.payload).code(code);
  } else {
    return h.response(payload)
    .code(code);
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
            //sendResponse(reply, payload, null, 200);
            return payload;
          } else {
            const state = {
              type: 'data',
              payload: {
                firstVisit: false,
              },
            };
            sendResponse(h, results, state, 401);
            //return results;
          }
        }
      );
    },
    (err) => {
      console.log(err);
      //sendResponse(reply, err, null, 401);
      return err;
    }
  );
};

const getName = (token) => {
  const payload = {
    firstName: null,
    lastName: null,
    email: null,
  };
  payload.email = token.email;
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
  const { firstName, lastName, email } = getName(token);
  return api.thirdPartyLogins.search(
    'google',
    uid,
    firstName,
    lastName,
    email,
  );
};


const thirdPartyLogin = (request, h) => {
  console.log(request.payload);
  const type = request.payload.type;
  const token = request.payload.token;
  const uid = (token.user) ? token.user.uid : token.uid;
  let result = {
    user: null,
    person: null,
  };
  if (type === 'google') {
    return getGoogleLogin(token)
    .then(
      (results) => {
        let retVal;
        console.log(results);
        if (results && request.payload.username) {
          const user = results;
          user.username = `${user.firstName} ${user.lastName}`;
          retVal = user;
        } else {
          result = Object.assign(
            {},
            result,
            {
              user: {
                peopleId: null,
                uid,
                entityId: null,
                type: 'google',
              },
              person: results,
            }
          );
          retVal = loginPayload(result);
        }

        return retVal;
      },
    )
    .catch(
      (err) => {
        console.log(err);
        //sendResponse(reply, err, null, 401);
        return err;
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
