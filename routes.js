/*
 * routes.js
 * ルーティングを提供するモジュール
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

//------ モジュールスコープ変数開始 -----------
'use strict';
var
  configRoutes,
  mongodb     = require( 'mongodb' ),

  mongoServer = new mongodb.Server(
    'localhost',
    '27017'
  ),
  dbHandle    = new mongodb.Db(
    'nb', mongoServer, { safe: true }
  ),

  makeMongoId = mongodb.ObjectID;

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 -----------
configRoutes = function( app, server ) {
  app.get( '/', function( request, response ) {
    //response.redirect( 'index.html' );
    response.sendFile( '/index.html' );
  });

  app.all( '/:obj_type/*?', function( request, response, next ) {});

  app.get( '/:obj_type/list', function( request, response ) {});

  app.post( '/:obj_type/create', function( request, response ) {});

  app.get( '/:obj_type/read/:id', function( request, response ) {});

  app.post( '/:obj_type/update/:id', function( request, response ) {});

  app.get( '/:obj_type/delete/:id', function( request, response ) {});
};

module.exports = { configRoutes: configRoutes };
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
dbHandle.open( function() {
  console.log( '** Connected to MongoDB **' );
});
//------ モジュール初期化終了 -------------
