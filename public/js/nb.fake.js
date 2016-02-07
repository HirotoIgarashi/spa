/*
 * nb.fake.js
 * フェイクモジュール
*/

/*jslint        browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

nb.fake = (function() {
  'use strict';

  var getPeopleList,
      fakeIdSerial,
      makeFakeId,
      mockSio;

  fakeIdSerial = 5;

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };


  getPeopleList = function () {
    return [
      {
        first_name  : 'Igarashi',
        last_name   : 'Hiroto',
        email       : 'test@test.com',
        password    : 'test0000',
        _id         : 'id_01'
      }
    ];
  };

  mockSio = (function () {
    var on_sio,
        emit_sio,
        callback_map = {};


    on_sio = function ( msg_type, callback ) {
      callback_map[ msg_type ] = callback;
    };

    emit_sio = function ( msg_type, data ) {
      // 3秒間の遅延後に「userupdate」コールバックで
      // 「adduser」イベントに応答する
      if ( msg_type === 'adduser' && callback_map.userupdate ) {
        setTimeout( function () {
          callback_map.userupdate(
            [{
              _id : makeFakeId(),
              first_name  : data.first_name,
              last_name   : data.last_name,
              email       : data.email,
              password    : data.password
            }]
          );
        }, 3000 );
      }
    };

    return {
      emit  : emit_sio,
      on    : on_sio
    };
  }());

  return {
    getPeopleList : getPeopleList,
    mockSio       : mockSio
  };
}());
