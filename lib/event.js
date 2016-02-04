/*
 * event.js
 * event機能を提供するモジュール
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
var eventObj,
    socket  = require( 'socket.io' ),
    crud    = require( './crud' );

//------ モジュールスコープ変数終了 -----------

//------ ユーティリティメソッド開始 ----------
//------ ユーティリティメソッド終了 ----------
//------ パブリックメソッド開始 ----------
eventObj = {
  connect : function ( server ) {
    var io = socket.listen( server );

    // io設定開始
    io
      //.set( 'blacklist', [] )
      .of( '/event' )
      .on( 'connection', function ( socket ) {
        socket.on( 'addevent',    function (){});
        socket.on( 'updateevent', function (){});
        socket.on( 'deleteevent', function (){});
        socket.on( 'readevent',   function (){});
      });
    // io設定終了
    return io;
  }
};

module.exports  = eventObj;
//------ パブリックメソッド終了 -----------

//------ モジュール初期化開始 
//------ モジュール初期化終了 -------------
