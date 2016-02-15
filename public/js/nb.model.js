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
      user            : null,
      person          : null,
      event           : {}
    },
    isFakeData = false,
    personProto,
    makeCid,
    completeLogin,
    makePerson,
    removePerson,
    people,
    person,
    event,
    _publish_eventlistread,
    _publish_personread,
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
    var cid         = person_map.cid || 'cid',
        id          = person_map.id || 'id',
        first_name  = person_map.first_name || 'first_name',
        last_name   = person_map.last_name || 'last_name',
        email       = person_map.email,
        password    = person_map.password || 'password';

    if ( email === undefined ) {
      throw 'email required';
    }

    person            = Object.create( personProto );
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
        set_user_by_email,
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

    set_user_by_email = function ( email ) {
      var sio = isFakeData ? nb.fake.mockSio : nb.data.getSio();

      sio.on( 'userread', function( user_list ) {
        var user_map = user_list[ 0 ];
        stateMap.user = {
          cid         : user_map._id,
          first_name  : user_map.first_name,
          last_name   : user_map.last_name,
          email       : user_map.email,
          password    : user_map.password
        };
      });

      sio.emit( 'readuser', { email: email } );

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
      get_by_cid        : get_by_cid,
      get_db            : get_db,
      get_user          : get_user,
      set_user_by_email : set_user_by_email,
      login             : login,
      logout            : logout
    };
  }());

  person = (function () {
    var fetchRemote,
        create,
        read,
        update,
        destroy;

    fetchRemote = function ( email ) {
      var sio = nb.data.getSio();

      sio.emit( 'readperson', { email: email } );
    };

    create  = function ( person_map ) {
      stateMap.person = person_map;
    };
    
    read    = function () {
      return stateMap.person;
    };

    update  = function () {
      console.log( "Do later" );
    };

    destroy = function () {
      console.log( "Do later" );
    };

    return {
      fetchRemote : fetchRemote,
      create      : create,
      read        : read,
      update      : update,
      destroy     : destroy
    };
  }());

  event = (function () {
    var fetchRemote,
        create,
        read,
        readList,
        update,
        destroy,
        _publish_eventcreate,
        sio = nb.data.getSio();

    fetchRemote = function( event_map ) {
      //var sio = nb.data.getSio();

      //sio.on( 'eventlistread', _publish_eventlistread );

      sio.emit( 'readeventlist', event_map );
    };

    create  = function ( event_map ) {
      //var sio = nb.data.getSio();

      sio.on( 'eventcreate', _publish_eventcreate );

      sio.emit( 'createevent', event_map );
    };

    read    = function ( event_map ) {
      //var sio = nb.data.getSio();

      //sio.on( 'eventread', _publish_eventlistread );

      sio.emit( 'readevent', event_map );
    };

    readList = function ( event_map ) {
      //var sio = nb.data.getSio();

      //sio.on( 'eventlistread', _publish_eventlistread );

      sio.emit( 'readeventlist', event_map );
    };

    update  = function ( event_map ) {
      console.log( event_map );
    };

    destroy = function ( event_map ) {
      console.log( event_map );
    };

    _publish_eventcreate = function ( result_list ) {
      var result_map = result_list[ 0 ];

      $.gevent.publish( 'eventcreate', result_map );
    };

    /*
    _publish_eventlistread = function ( result_list ) {
      var i,
          result_map = result_list[ 0 ];

      stateMap.event = {};

      for ( i = 0; i < result_map.length; ++i ) {
        // modelにデータを保持する。
        stateMap.event[ result_map[ i ]._id ] = result_map[ i ];
      }

      $.gevent.publish( 'eventlistupdate', stateMap.event );
    };
    */


    return {
      fetchRemote : fetchRemote,
      create      : create,
      read        : read,
      readList    : readList,
      update      : update,
      destroy     : destroy
    };
  }());

  _publish_eventlistread = function ( result_list ) {
    var i,
        result_map = result_list[ 0 ];

    stateMap.event = {};

    for ( i = 0; i < result_map.length; ++i ) {
      // modelにデータを保持する。
      stateMap.event[ result_map[ i ]._id ] = result_map[ i ];
    }

    $.gevent.publish( 'eventlistupdate', stateMap.event );
  };

  _publish_personread = function ( result_list ) {
    var person_map = result_list[ 0 ];
    stateMap.person = {
      _id         : person_map._id,
      first_name  : person_map.first_name,
      last_name   : person_map.last_name,
      email       : person_map.email,
      password    : person_map.password
    };

    $.gevent.publish( 'personread', stateMap.person );
  };

  //パブリックメソッド/initModule/開始
  initModule = function () {
    var i,
        people_list,
        person_map,
        sio = nb.data.getSio();

    sio.on( 'eventlistread',  _publish_eventlistread );
    sio.on( 'personread',     _publish_personread );
    // 匿名ユーザを初期化する
    /*
    stateMap.anon_user = makePerson({
      cid         : configMap.anon_id,
      id          : configMap.anon_id,
      first_name  : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;
    */

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
    person      : person,
    event       : event
  };
  //------ パブリックメソッド終了 ---------------
}());
