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
    socket  = require( 'socket.io' ),
    crud    = require( './crud' );

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
        socket.on( 'foo', function ( data ){
          console.log( data );
        });
        socket.on( 'usercreate',  function ( user_map ) {
          console.log( user_map );
        });

        socket.on( 'userread',    function ( user_map ) {
          console.log( user_map );
        });

        socket.on( 'updateuser',  function ( user_map ) {
          console.log( user_map );
        });
        
        socket.on( 'deleteuser',  function ( user_map ) {
          console.log( user_map );
        });

        socket.on( 'loginuser',   function ( user_map ) {
          console.log( user_map );
        });

        socket.on( 'logoutuser',  function ( user_map ) {
          console.log( user_map );
        });

        socket.on( 'createevent', function ( event_map ) {
          crud.construct(
            'event',
            event_map,
            function ( result_list ) {

              socket.emit( 'eventcreate', result_list );
            }
          );
        });

        socket.on( 'readevent',   function ( event_map ) {
          crud.read(
            'event',
            { _id  : event_map.id },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'eventread', result_map );
            }
          );
        });

        socket.on( 'updateevent', function ( event_map ) {
          crud.update(
            'event',
            { _id : event_map.id },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'eventupdate', result_map );
            }
          );
        });

        socket.on( 'deleteevent', function ( event_map ) {
          crud.destroy(
            'event',
            { _id : event_map.id },
            {},
            function ( result_list ) {
              var result_map;

              result_map = result_list[ 0 ];
              socket.emit( 'eventdelete', result_map );
            }
          );
        });
      });
    // io設定終了
    return io;
  }
};

module.exports  = notebookObj;
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
//------ モジュール初期化終了 -------------
