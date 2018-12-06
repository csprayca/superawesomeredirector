'use strict';

/**
 * Represents the super simple setup for the super awesome redirector that just works. See this awesome tool in action: {@link https://lastminutelaura.ca Example 1}.
 * Sample usage with {@link https://nextjs.org nextjs}:
 * ```js
 * const express = require('express');
 const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev });
const handle = app.getRequestHandler();

const { links } = require('../src/data/data');
const SuperAwesomeRedirector = require('../src/SuperAwesomeRedirector');

app
  .prepare()
  .then(() => {
    const server = express();

    SuperAwesomeRedirector({ expressServ: server, data: links });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(2369, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:2369');
    });
  })
  .catch(ex => {
    console.log(ex.stack);
    process.exit(1);
  });

 * ```
 * ## References
 * - [https://www.raygesualdo.com/posts/301-redirects-with-nextjs/](https://www.raygesualdo.com/posts/301-redirects-with-nextjs/)
 * - [https://www.robinwieruch.de/react-svg-patterns/](https://www.robinwieruch.de/react-svg-patterns/)
 * - [https://stackoverflow.com/a/11957822](https://stackoverflow.com/a/11957822)
 * - [https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/](https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/)
 * - [http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/](http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/) - used in testing redirects in middlewear
 * @param {Object} expressServ - **Required**. Express server instance.
 * @param {Array} data - **Required**. Array holding the simple super awesome redirector json data items.
 * @param {Boolean} verbose - Optional. default: **true**. Would you like to see the installation of the routes? For example:
 * ```
 * attaching the following config:
 * fromURL, /latestvideo, toURL, https://youtu.be/bwESQ8wOJ5Y
 * ```
 * @param {Boolean} log - Optional. default: **true**. Would you like to see the route logs? In a convenient csv format. For example:
 * ```
 * redirecting, from, /latestvideo, to, https://youtu.be/bwESQ8wOJ5Y, time, 2018-12-05T22:51:25.000Z
 * ```
 */
const SuperAwesomeRedirector = ({
  expressServ,
  data,
  verbose = true,
  log = true
}) => {
  if (expressServ === undefined || typeof expressServ !== 'function') {
    throw new Error(
      'SuperAwesomeRedirector needs an instance of the express server.'
    );
  }

  if (typeof expressServ.get !== 'function') {
    throw new Error('missing the get fn of express app');
  }

  if (data === undefined || data.length === 0) {
    throw new Error('SuperAwesomeRedirector needs data array of json items');
  }

  if (data[0].toURL === undefined) {
    throw new Error(
      `SuperAwesomeRedirector needs data array of json item needs toURL attribute. This is where you want to send your visor. For example, { toURL : "https://www.youtube.com/channel/UCB5mFx3KjuOuMZoXDLSUvSg" }`
    );
  }

  if (data[0].fromURL === undefined) {
    throw new Error(
      `SuperAwesomeRedirector needs data array of json item needs fromURL attribute. This is the link that you share with your visitor. For example, { fromURL: '/onyoutube' }`
    );
  }

  data.forEach(({ toURL, fromURL, type = 301, method = 'get' }) => {
    if (verbose) {
      console.log(`attaching the following config:`);
      console.log(`fromURL, ${fromURL}, toURL, ${toURL}`);
    }

    expressServ[method](fromURL, (req, res) => {
      if (log) {
        console.log(
          `redirecting, from, ${fromURL}, to, ${toURL}, time, ${new Date(
            new Date().toUTCString()
          ).toISOString()}`
        );
      }

      return res.redirect(toURL);
    });
  });
};

exports = module.exports = SuperAwesomeRedirector;
