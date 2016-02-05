/*
 * socketio.js
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
var socketioObj,
    fs      = require( 'fs' ),
    socket  = require( 'socket.io' ),
    /*
      .listen(443, {
        key : fs.readFileSync( 'key.pem' ),
        cert  : fs.readFileSync( 'cert.pem' )
      }),
    */
    crud    = require( './crud' );

//------ モジュールスコープ変数終了 -----------

//------ ユーティリティメソッド開始 ----------
//------ ユーティリティメソッド終了 ----------
//------ パブリックメソッド開始 ----------
socketioObj = {
  connect : function ( server ) {
    var io = socket.listen( server );

    // io設定開始
    io
      //.set( 'blacklist', [] )
      .of( '/foo' )
      .on( 'connection', function ( socket ) {
        socket.on( 'foo',    function ( data ){
          cnosole.log( data );
        });
        socket.on( 'addevent',    function (){});
        socket.on( 'updateevent', function (){});
        socket.on( 'deleteevent', function (){});
        socket.on( 'readevent',   function (){});
      });
    // io設定終了
    return io;
  }
};

module.exports  = socketioObj;
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
//------ モジュール初期化終了 -------------
