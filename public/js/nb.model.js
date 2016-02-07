/*
 * nb.model.js
 * モデルモジュール
*/

/*jslint        browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global TAFFY, $, nb */

nb.model = (function() {
  'use strict';
  var
    configMap = {
      anon_id : 'a0'
    },
    stateMap = {
      anon_user       : null,
      cid_serial      : 0,
      people_cid_map  : {},
      people_db       : TAFFY(),
      user            : null
    },
    isFakeData = false,
    personProto,
    makeCid,
    //clearPeopleDb,
    completeLogin,
    makePerson,
    removePerson,
    people,
    event,
    eventCreateResult,
    initModule;

  personProto = {
    get_is_user : function () {
      return this.cid === stateMap.user.cid;
    },
    get_is_anon : function () {
      return this.cid === stateMap.anon_user.cid;
    }
  };

  makeCid = function () {
    return 'c' + String( stateMap.cid_serial++ );
  };

  /*
  clearPeopleDb = function () {
    var user = stateMap.user;

    stateMap.people_db      = TAFFY();
    stateMap.people_cid_map = {};
    if ( user ) {
      stateMap.people_db.insert( user );
      stateMap.people_cid_map[ user.cid ] = user;
    }
  };
  */

  completeLogin = function ( user_list ) {
    var user_map = user_list[ 0 ];

    delete stateMap.people_cid_map[ user_map.cid ];
    stateMap.user.cid = user_map._id;
    stateMap.user.id  = user_map._id;
    stateMap.people_cid_map[ user_map._id ] = stateMap.user;

    // チャットを追加するときには、ここで参加すべき
    $.gevent.publish( 'nb-login', [ stateMap.user ] );
  };

  makePerson = function ( person_map ) {
    var person,
        cid         = person_map.cid,
        id          = person_map.id,
        first_name  = person_map.first_name,
        last_name   = person_map.last_name,
        email       = person_map.email,
        password    = person_map.password;

    if ( cid === undefined || ! first_name ) {
      throw 'client id and first_name required';
    }

    person= Object.create( personProto );
    person.cid        = cid;
    person.first_name = first_name;
    person.last_name  = last_name;
    person.email      = email;
    person.password   = password;

    if ( id ) {
      person.id = id;
    }

    stateMap.people_cid_map[ cid ] = person;

    stateMap.people_db.insert( person );
    return person;
  };

  removePerson = function ( person ) {
    if ( ! person ) {
      return false;
    }
    // 匿名ユーザは削除できない
    if ( person.id === configMap.anon_id ) {
      return false;
    }

    stateMap.people_db({
      cid : person.cid
    }).remove();
    if ( person.cid ) {
      delete stateMap.people_cid_map[ person.cid ];
    }
    return true;
  };

  people = (function () {
    var get_by_cid,
        get_db,
        get_user,
        login,
        logout;

    get_by_cid = function ( cid ) {
      return stateMap.people_cid_map[ cid ];
    };

    get_db  = function () {
      return stateMap.people_db;
    };

    get_user = function () {
      return stateMap.user;
    };

    login = function ( email ) {
      var sio = isFakeData ? nb.fake.mockSio : nb.data.getSio();

      stateMap.user = makePerson({
        cid         : makeCid(),
        first_name  : 'first_name',
        last_name   : 'last_name',
        email       : email,
        password    : 'password'
      });

      sio.on( 'userupdate', completeLogin );

      sio.emit( 'adduser', {
        cid         : stateMap.user.cid,
        first_name  : stateMap.user.first_name,
        last_name   : stateMap.user.last_name,
        email       : stateMap.user.email,
        password    : stateMap.user.password
      });
    };
    
    logout = function () {
      var is_removed,
          user = stateMap.user;

      // チャットを追加するときには、ここでチャットルームから出るべき
      is_removed  = removePerson( user );
      stateMap.user = stateMap.anon_user;

      $.gevent.publish( 'nb-logout', [ user ] );
      
      return is_removed;
    };

    return {
      get_by_cid  : get_by_cid,
      get_db      : get_db,
      get_user    : get_user,
      login       : login,
      logout      : logout
    };
  }());

  event = (function () {
    var create,
        read,
        update,
        destroy;

    create  = function ( event_map ) {
      var sio = nb.data.getSio();

      sio.on( 'eventcreate', eventCreateResult );

      sio.emit( 'createevent', event_map );
    };

    read    = function ( event_map ) {
      console.log( event_map );
    };

    update  = function ( event_map ) {
      console.log( event_map );
    };

    destroy = function ( event_map ) {
      console.log( event_map );
    };

    return {
      create  : create,
      read    : read,
      update  : update,
      destroy : destroy
    };
  }());

  eventCreateResult = function ( result_list ) {
    var result_map = result_list[ 0 ];

    $.gevent.publish( 'event-create-result', result_map );
  };

  //パブリックメソッド/initModule/開始
  initModule = function () {
    var i,
        people_list,
        person_map;

    // 匿名ユーザを初期化する
    stateMap.anon_user = makePerson({
      cid         : configMap.anon_id,
      id          : configMap.anon_id,
      first_name  : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;

    if ( isFakeData ) {
      people_list = nb.fake.getPeopleList();
      for ( i = 0; i < people_list.length; ++i ) {
        person_map = people_list[ i ];
        makePerson({
          cid : person_map._id,
          id  : person_map._id,
          first_name  : person_map.first_name,
          last_name   : person_map.last_name,
          email       : person_map.email,
          password    : person_map.passw
        });
      }
    }
  };
  //パブリックメソッド/initModule/終了

  //パブリックメソッドを返す
  return {
    initModule  : initModule,
    people      : people,
    event       : event
  };
  //------ パブリックメソッド終了 ---------------
}());
