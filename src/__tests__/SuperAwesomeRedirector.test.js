// Get back to testing
// - express, jest, enzyme, middleware testing
// https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/

/* eslint-env jest */

const SuperAwesomeRedirector = require('../SuperAwesomeRedirector');
const express = require('express');
const request = require('supertest');

const superAwesomeApp = () => {
  const app = express();
  return app;
};

describe('SuperAwesomeRedirector', () => {
  describe('given invalid input to module', () => {
    test('it throws an error by default when everything is missing', () => {
      const expectedErrMsg = `Cannot read property 'expressServ' of undefined`;
      const expectedErrMsg002 =
        "Cannot destructure property `expressServ` of 'undefined' or 'null'";

      expect(() => {
        SuperAwesomeRedirector();
      }).toThrowError(expectedErrMsg002);
    });

    test('it throws an error if express instance is missing', () => {
      const expectedErrMsg = `SuperAwesomeRedirector needs an instance of the express server.`;

      expect(() => {
        let options = { expressServ: {} };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });

    test('it throws an error if express instance does not have a get function', () => {
      const expectedErrMsg = `missing the get fn of express app`;

      expect(() => {
        let options = { expressServ: jest.fn(() => Promise.resolve()) };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });

    test('it throws an error if data is undefined', () => {
      const expectedErrMsg = `SuperAwesomeRedirector needs data array of json items`;

      expect(() => {
        let serv = jest.fn(() => Promise.resolve());
        serv['get'] = jest.fn(() => Promise.resolve());

        let options = {
          expressServ: serv,
          data: undefined
        };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });

    test('it throws an error if data is an empty array', () => {
      const expectedErrMsg = `SuperAwesomeRedirector needs data array of json items`;

      expect(() => {
        let serv = jest.fn(() => Promise.resolve());
        serv['get'] = jest.fn(() => Promise.resolve());

        let options = { expressServ: serv, data: [] };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });

    test(`it throws an error if data's first item missing toURL`, () => {
      const expectedErrMsg = `SuperAwesomeRedirector needs data array of json item needs toURL attribute. This is where you want to send your visor. For example, { toURL : 'https://www.youtube.com/channel/UCB5mFx3KjuOuMZoXDLSUvSg' }`;

      expect(() => {
        let serv = jest.fn(() => Promise.resolve());
        serv['get'] = jest.fn(() => Promise.resolve());

        let options = { expressServ: serv, data: [[{}]] };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });

    test(`it throws an error if data's first item is missing fromURL`, () => {
      const expectedErrMsg = `SuperAwesomeRedirector needs data array of json item needs fromURL attribute. This is the link that you share with your visitor. For example, { fromURL: '/youtube' }`;

      expect(() => {
        let serv = jest.fn(() => Promise.resolve());
        serv['get'] = jest.fn(() => Promise.resolve());

        let data = [
          { toURL: 'https://www.youtube.com/channel/UCB5mFx3KjuOuMZoXDLSUvSg' }
        ];

        let options = { expressServ: serv, data: data };

        SuperAwesomeRedirector(options);
      }).toThrowError(expectedErrMsg);
    });
  });

  describe('given valid input', () => {
    test('it works', async () => {
      const app = superAwesomeApp();
      const links = [
        {
          title: 'Youtube',
          toURL: 'https://www.youtube.com/channel/UCB5mFx3KjuOuMZoXDLSUvSg',
          fromURL: '/youtube'
        }
      ];

      SuperAwesomeRedirector({
        expressServ: app,
        data: links
      });

      const res = await request(app).get(links[0].fromURL);
      const EXPECTED_RESPONSE_STATUS = 302;

      expect(res.status).toEqual(EXPECTED_RESPONSE_STATUS);
      expect(res.header.location).toEqual(links[0].toURL);
    });
  });
});
