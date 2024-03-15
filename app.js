var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');


const port = 8000
var app = express();

async function main() {
    // Use connect method to connect to the server
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    const dbName = 'c22';
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    return db
}

main()
    .then(db => {
        const collection = db.collection('challenges');

        // the following code examples can be pasted here..

        var indexRouter = require('./routes/index')(db);
        var dataRouter = require('./routes/data')(db);

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));

        app.use('/', indexRouter);
        app.use('/data', dataRouter);

        var debug = require('debug')('c22:server');
        var http = require('http');

        /**
         * Get port from environment and store in Express.
         */

        var port = normalizePort(process.env.PORT || '8000');
        app.set('port', port);

        /**
         * Create HTTP server.
         */

        var server = http.createServer(app);

        /**
         * Listen on provided port, on all network interfaces.
         */

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        /**
         * Normalize a port into a number, string, or false.
         */

        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }
    })
    .catch((err) => {
        console.log(err)
    })

module.exports = app