/*
 * notebook.js
 * socket.io機能を提供するモジュール
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
var notebookObj,
    socket      = require( 'socket.io' ),
    crud        = require( './crud' ),
    makeMongoId = crud.makeMongoId;

//------ モジュールスコープ変数終了 -----------

//------ ユーティリティメソッド開始 ----------
//------ ユーティリティメソッド終了 ----------
//------ パブリックメソッド開始 ----------
notebookObj = {
  connect : function ( server ) {
    var io = socket.listen( server );

    // io設定開始
    io
      .of( '/notebook' )
      .on( 'connection', function ( socket ) {
        socket.on( 'createuser',  function ( user_map ) {
          //console.log( user_map );
        });

        socket.on( 'readperson',    function ( user_map ) {
          crud.read(
            'user',
            { email  : user_map.email },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'personread', result_map );
            }
          );
        });

        socket.on( 'readuser',    function ( user_map ) {
          crud.read(
            'user',
            { email  : user_map.email },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'userread', result_map );
            }
          );
        });

        socket.on( 'updateuser',  function ( user_map ) {
          //console.log( user_map );
        });
        
        socket.on( 'deleteuser',  function ( user_map ) {
          //console.log( user_map );
        });

        socket.on( 'loginuser',   function ( user_map ) {
          //console.log( user_map );
        });

        socket.on( 'logoutuser',  function ( user_map ) {
          //console.log( user_map );
        });

        socket.on( 'createevent', function ( event_map ) {
          var event_id;

          event_id = event_map._id;
          delete event_map._id;

          if ( event_id !== null ) {
            // updateの処理
            crud.update(
              'event',
              { _id : makeMongoId( event_id ) },
              event_map,
              function ( result_map ) {
                event_map._id = event_id;
                result_map.update_object = event_map;
                socket.emit( 'eventupdate', result_map );
              }
            );
          }
          else {
            crud.construct(
              'event',
              event_map,
              function ( result_list ) {
                socket.emit( 'eventcreate', result_list );
              }
            );
          }
        });

        socket.on( 'readevent',   function ( event_map ) {
          crud.read(
            'event',
            { _id  : makeMongoId( event_map.id ) },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'eventread', result_map );
            }
          );
        });

        socket.on( 'readeventlist',   function ( event_map ) {
          crud.read(
            'event',
            { person_id  : event_map.id },
            {},
            function ( result_list ) {
              socket.emit( 'eventlistread', result_list );
            }
          );
        });

        socket.on( 'updateevent', function ( event_map ) {
          crud.update(
            'event',
            { _id : makeMongoId( event_map.id ) },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'eventupdate', result_map );
            }
          );
        });

        // 削除するオブジェクト( event_list )を受け取りデータベースから
        // 削除する。
        socket.on( 'deleteevent', function ( event_list ) {
          var event_map = event_list[ 0 ];

          crud.destroy(
            'event',
            { _id : makeMongoId( event_map._id ) },
            function ( result_map ) {
              var return_map;

              // 削除したオブジェクトを追加する。
              result_map.delete_object = event_map;

              socket.emit( 'eventdelete', result_map );
            }
          );
        });

        socket.on( 'read:localBusiness', function ( localBusiness_map ) {
          crud.read(
            'localBusiness',
            { localBusiness_map },
            {},
            function ( result_list ) {
              socket.emit( 'localBusiness:read', result_list );
            }
          );
        });

        socket.on( 'create:localBusiness', function ( localBusiness_map ) {
          crud.construct(
            'localBusiness',
            localBusiness_map,
            function ( result_list ) {
              socket.emit( 'localBusiness:create', result_list );
            }
          );
        });

        socket.on( 'update:localBusiness', function ( localBusiness_list ) {});
        socket.on( 'delete:localBusiness', function ( localBusiness_list ) {});

      });
    // io設定終了
    return io;
  }
};

module.exports  = notebookObj;
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
//------ モジュール初期化終了 -------------
