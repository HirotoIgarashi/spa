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
  crypto      = require( 'crypto' ),

  mongoServer = new mongodb.Server(
    'localhost',
    '27017'
  ),
  dbHandle    = new mongodb.Db(
    'nb', mongoServer, { safe: true }
  ),

  makeMongoId = mongodb.ObjectID,
  objTypeMap  = { 'user': { } };

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 -----------
configRoutes = function( app, server ) {
  app.get( '/', function( request, response ) {
    response.redirect( 'index.html' );
  });

  app.all( '/:obj_type/*?', function( request, response, next ) {
    response.contentType( 'json' );
    if ( objTypeMap[ request.params.obj_type ] ) {
      next();
    }
    else {
      response.send(JSON.stringify({ error_msg : request.params.obj_type
                    + ' is not a valid object type'
      }));
    }
    //next();
  });

  app.get( '/:obj_type/list', function( request, response ) {
    dbHandle.collection(
      request.params.obj_type,
      function( outer_error, collection ) {
        collection.find().toArray(
          function ( inner_error, map_list ) {
            response.send( map_list );
          }
        );
      }
    );
  });

  app.post( '/:obj_type/create', function( request, response ) {
    var options_map = { safe: true },
        obj_map     = request.body;

    dbHandle.collection(
      request.params.obj_type,
      function( outer_error, collection ) {
        // userの処理
        if ( request.params.obj_type === "user" ) {
          collection.find().toArray(
            function ( inner_error, map_list )  {
              var error,
                  i,
                  email       = request.body.email,
                  password    = request.body.password,
                  passconf    = request.body.passconf,
                  hash        = crypto
                                  .createHash('md5')
                                  .update(password)
                                  .digest('hex');

              for ( i = 0; i < map_list.length; i++ ) {
                if ( email === map_list[i].email ) {
                  error = true;
                  response
                    .status(409)
                    .send("同じemailアドレスが登録されています。");
                }
              }
              
              if ( password !== passconf ) {
                error = true;
                response
                  .status(409)
                  .send('パスワードが一致していません。');
              }

              if ( !error ) {
                // パスワードを暗号化したものに書き換える。
                obj_map.password = hash;
                // passconfは登録しないので削除する。
                delete obj_map.passconf;

                collection.insert(
                  obj_map,
                  options_map,
                  function ( inner_error, result_map ) {
                    response.send( result_map );
                  }
                );
              }
            }
          );
        }
        // user以外の処理
        else {
          collection.insert(
            obj_map,
            options_map,
            function ( inner_error, result_map ) {
              response.send( result_map );
            }
          );
        }
      }
    );
  });

  app.get( '/:obj_type/read/:id', function( request, response ) {
    var find_map = { _id: makeMongoId( request.params.id ) };

    dbHandle.collection(
      request.params.obj_type,
      function( outer_error, collection ) {
        collection.findOne(
          find_map,
          function ( inner_error, result_map ) {
            response.send( result_map );
          }
        );
      }
    );
  });

  app.post( '/:obj_type/update/:id', function( request, response ) {
    var find_map  = { _id: makeMongoId( request.params.id ) },
        obj_map   = request.body;

    dbHandle.collection(
      request.params.obj_type,
      function( outer_error, collection ) {
        var sort_order = [],
            options_map = {
              'new'   : true,
              upsert  : false,
              safe    : true
            };

        collection.findAndModify(
          find_map,
          sort_order,
          obj_map,
          options_map,
          function ( inner_error, updated_map ) {
            response.send( updated_map );
          }
        );
      }
    );
  });

  app.get( '/:obj_type/delete/:id', function( request, response ) {
    var find_map = { _id: makeMongoId( request.params.id ) };

    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        var options_map = {
          safe    : true,
          single  : true
        };

        collection.remove(
          find_map,
          options_map,
          function ( inner_error, delete_count ) {
            response.send({ delete_count: delete_count });
          }
        );
      }
    );
  });
};

module.exports = { configRoutes: configRoutes };
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
dbHandle.open( function() {
  console.log( '** Connected to MongoDB **' );
});
//------ モジュール初期化終了 -------------
