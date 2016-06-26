import Joi from 'joi';
import api from '../src/lib/server';
import utils from '../src/lib/utils';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import settings from '../config/settings.json';
console.log(settings.jwtKey);
const key = fs.readFileSync(settings.jwtKey),
      prefix = "/api/auth";

module.exports = [
  {
    method: 'POST',
    path: prefix + "/login",

    handler: function (request, reply) {
      console.log(request.payload);
      utils
      .getPeoplePassword(request.payload.email)
      .then(
        function(results) {
          console.log(results);
          if (results) {
            jwt.sign(
              {
                peopleId: results.user.peopleId
              },
              key,
              {
                expiresIn: '7d',
                issuer: 'evangelizeIo',
                algorithm: 'RS256'
              },
              function(token) {
                let payload = {
                  user: results,
                  jwt: token
                };
                reply( payload ).code( 200 );
              }
            );
          } else {
            reply( results ).code( 401 );
          }
        },
        function(err) {
          console.log(err);
          reply( err ).code( 401 );
        }
      );
    }
  },
];
