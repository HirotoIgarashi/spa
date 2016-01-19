/*
 * app.js - Express server with routing
*/

/*jslint          node    : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : false,
  white   : true
*/
/*global */

// ----------------- モジュールスコープ変数開始 -------------------
'use strict';
var https       = require( 'https' ),
    fs          = require( 'fs' ),
    express     = require( 'express' ),
    redis       = require( 'redis' ),
    session     = require( 'express-session' ),
    RedisStore  = require( 'connect-redis' )( session ),
    client      = redis.createClient(),
    routes      = require( './routes' ),
    app         = express(),
    opts        = {
      key   : fs.readFileSync('key.pem'),
      cert  : fs.readFileSync('cert.pem'),
      NPNProtocols  : ['http/2.0', 'spdy', 'http/1.1']
    },
    server      = https.createServer( opts, app );
// ----------------- モジュールスコープ変数終了 -------------------

// ----------------- サーバ構成開始 -------------------------------
app.configure( function () {
  app.use( express.logger() );
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.cookieParser() );
  app.use( express.session({
    secret            : 'koobetoN',
    cookie            : {
      secure    : true,
      httpOnly  : false,
      expires   : new Date(Date.now() + 4 * 604800000)
      //expires   : new Date(Date.now() + 60 * 60)
      //maxAge    : 1000*60*60*24*7 // 1 week
    },
    store             : new RedisStore({
      host    : 'localhost',
      port    : 6379,
      client  : client,
      ttl     : 260
    }),
    saveUninitialized : false,
    resave            : false
  }) );
  app.use( express.static( __dirname + '/public' ) );
  app.use( app.router );
});

routes.configRoutes( app, server );
// ----------------- サーバ構成終了 -------------------------------

// ----------------- サーバ起動開始 -------------------------------
server.listen( 443 );
console.log(
  'Express server listening on port %d in %s mode',
  //server.address().port, app.settings.env
  server.address().port, app.settings.env
);
// ----------------- サーバ起動終了 -------------------------------
