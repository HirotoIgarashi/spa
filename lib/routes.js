/*
 * routes.js
 * ルーティングを提供するモジュール
 */

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global */

//------ モジュールスコープ変数開始 -----------
'use strict';
var
  configRoutes,
  crypto      = require( 'crypto' ),
  crud        = require( './crud' ),
  socketio    = require( './socketio' ),
  makeMongoId = crud.makeMongoId;

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 -----------
configRoutes = function( app, server ) {

  app.get( '/', function( request, response ) {
    response.redirect( 'index.html' );
  });

  app.all( '/:obj_type/*?', function( request, response, next ) {
    response.contentType( 'json' );
    next();
  });

  app.get( '/user/authentication', function( request, response ) {
    if ( request.session.user ) {
      response.send({"state": "success", "email": request.session.user.email });
    }
    else {
      response.send({"state": "failed"});
    }
  });

  app.post( '/user/login', function( request, response ) {
    var email       = request.body.email,
        password    = request.body.password,
        find_map = { "email": request.body.email };

    crud.read(
      'user',
      find_map,
      {},
      function ( map_list ) {
        if ( map_list !== null && password === map_list[0].password ) {
          request.session.user = {
            email: email
          };
          response.send( map_list );
        }
        else {
          response
            .status(409)
            .send("emailアドレスが登録されていないかパスワードと一致しません。");
        }
      }
    );
  });

  app.get( '/user/logout', function( request, response ) {
    request.session.destroy( function( err ) {
      if ( err ) {
        console.log( err );
      }
      response
        .status(200)
        .send( 'ログアウトしました' );
    } );
  } );

  app.post( '/user/create', function( request, response ) {
    var obj_map = request.body;

    crud.read(
      'user',
      {},
      {},
      function ( map_list ) {
        var error,
            i,
            email       = request.body.email,
            password    = request.body.password,
            passconf    = request.body.passconf;
            //hash        = crypto
            //                .createHash('md5')
            //                .update(password)
            //                .digest('hex');

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
          //obj_map.password = hash;
          // passconfは登録しないので削除する。
          delete obj_map.passconf;

          crud.construct(
            'user',
            obj_map,
            function ( result_map ) {
              response.send( result_map );
            }
          );
        }
      }
    );
  });

  app.get( '/:obj_type/list', function( request, response ) {
    crud.read(
      request.params.obj_type,
      {},
      {},
      function ( map_list ) {
        response.send( map_list );
      }
    );
  });

  app.post( '/:obj_type/create', function( request, response ) {
    crud.construct(
      request.params.obj_type,
      request.body,
      function ( result_map ) {
        response.send( result_map );
      }
    );
  });

  app.get( '/:obj_type/read/:id', function( request, response ) {
    crud.read(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      {},
      function ( map_list ) {
        response.send( map_list );
      }
    );
  });

  app.post( '/:obj_type/update/:id', function( request, response ) {
    crud.update(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      request.body,
      function ( result_map ) {
        response.send( result_map );
      }
    );
  });

  app.get( '/:obj_type/delete/:id', function( request, response ) {
    crud.destroy(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      function ( result_map ) {
        response.send( result_map );
      }
    );
  });
  
  socketio.connect( server );
};

module.exports = { 
  configRoutes  : configRoutes
};
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
//------ モジュール初期化終了 -------------
