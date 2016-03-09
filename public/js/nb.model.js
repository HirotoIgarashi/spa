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
      event           : {},
      localBusiness   : {}
    },
    isFakeData = false,
    personProto,
    makeCid,
    completeLogin,
    makePerson,
    removePerson,
    people,
    person,
    _publish_personread,
    event,
    _publish_eventlistread,
    _publish_eventcreate,
    _publish_eventupdate,
    _publish_eventdelete,
    localBusiness,
    _publish_localbusiness_read,
    _publish_localbusiness_create,
    _publish_localbusiness_update,
    _publish_localbusiness_destroy,
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
        update,
        destroy,
        sio = nb.data.getSio();

    // サーバにデータを要求します。
    // データを取得したら_publish_eventstreadが呼ばれます。
    fetchRemote = function( event_map ) {
      sio.emit( 'readeventlist', event_map );
    };

    create  = function ( event_map ) {
      sio.emit( 'createevent', event_map );
    };

    read    = function ( event_map ) {
      var id,
          find_key,
          return_list = [];

      find_key = Object.keys( event_map )[ 0 ];

      for ( id in stateMap.event ) {
        if ( stateMap.event.hasOwnProperty( id ) ) {
          if ( stateMap.event[ id ][ find_key ].match( event_map[ find_key ] )) {
            return_list.push( stateMap.event[ id ] );
          }
        }
      }
      
      return return_list;
    };

    update  = function ( event_map ) {
      console.log( event_map );
    };

    destroy = function ( event_map ) {
      sio.emit( 'deleteevent', event_map );
    };

    return {
      fetchRemote : fetchRemote,
      create      : create,
      read        : read,
      update      : update,
      destroy     : destroy
    };
  }());

  localBusiness = (function () {
    var localBusinessProto,
        makeLocalBusiness,
        fetch,
        create,
        read,
        update,
        destroy,
        sio = nb.data.getSio();

    // localBusinessのプロトタイプ
    localBusinessProto = {
      fetch : fetch,
      create  : create,
      read    : read,
      update  : update,
      destroy : destroy
    };

    // localBusinessオブジェクトを作成する。
    makeLocalBusiness = function ( form_array ) {
      var local_business,
          i;

      localBusiness = Object.create( localBusinessProto );

      for ( i = 0; i < form_array.length; ++i ) {
        localBusiness[ form_array[ i ].name ] = form_array[ i ].value;
      }

      return localBusiness;
    };
    // サーバにデータを要求する。
    fetch     = function ( localBusiness_map ) {
      sio.emit( 'read:localBusiness', localBusiness_map );
    };

    create    = function ( localBusiness_map ) {
      sio.emit( 'create:localBusiness', localBusiness_map );
    };
    
    read      = function ( localBusiness_map ) {
      var id,
          find_key,
          return_list = [];

      find_key = Object.keys( localBusiness_map )[ 0 ];

      for ( id in stateMap.localBusiness ) {
        if ( stateMap.localBusiness.hasOwnProperty( id ) ) {
          if ( stateMap.localBusiness[ id ][ find_key ].match( localBusiness_map[ find_key ] )) {
            return_list.push( stateMap.localBusiness[ id ] );
          }
        }
      }
      
      return return_list;

    };

    update    = function ( localBusiness_map ) {
      sio.emit( 'update:localBusiness', localBusiness_map );
    };

    destroy   = function ( localBusiness_map ) {
      sio.emit( 'destroy:localBusiness', localBusiness_map );
    };

    return {
      makeLocalBusiness : makeLocalBusiness,
      fetch             : fetch,
      create            : create,
      read              : read,
      update            : update,
      destroy           : destroy
    };

  }());

  _publish_eventlistread = function ( result_list ) {
    var i,
        result_map = result_list[ 0 ];

    stateMap.event = {};

    for ( i = 0; i < result_map.length; ++i ) {
      // modelにデータを格納する。
      stateMap.event[ result_map[ i ]._id ] = result_map[ i ];
    }

    $.gevent.publish( 'eventlistupdate', stateMap.event );
  };

  _publish_eventcreate = function ( result_list ) {
    var result_map,
        event_map;

    if ( result_list[ 0 ].error_msg ) {
      console.log( result_list[ 0 ].error_msg );
    }
    else {
      result_map = result_list[ 0 ].ops[ 0 ];

      event_map = {
        _id       : result_map._id,
        name      : result_map.name,
        startDate : result_map.startDate,
        location  : result_map.location,
        person_id : result_map.person_id
      };

      stateMap.event[result_map._id] = event_map;

      $.gevent.publish( 'eventcreate', result_map );
    }
  };

  _publish_eventupdate = function ( result_list ) {
    var result_map = result_list[ 0 ].update_object;

    stateMap.event[ result_map._id ] = result_map;

    $.gevent.publish( 'eventupdate', result_map );
  };

  _publish_eventdelete = function ( result_list ) {
    var result_map = result_list[ 0 ].delete_object;

    delete stateMap.event[ result_map._id ];

    $.gevent.publish( 'eventdelete', result_map );
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

  _publish_localbusiness_read = function ( result_list ) {
    var i,
        result_map = result_list[ 0 ];

    if ( result_map.error_msg ) {
      $.gevent.publish( 'localBusiness:read:error', result_map.error_msg );
    }
    else {
      stateMap.localBusiness = {};

      for ( i = 0; i < result_map.length; ++i ) {
        // modelにデータを格納する。
        stateMap.localBusiness[ result_map[ i ]._id ] = result_map[ i ];
      }

      $.gevent.publish( 'localBusiness:read', stateMap.localBusiness );
    }
  };

  _publish_localbusiness_create   = function ( result_list ) {
    var result_map,
        localBusiness_map;

    if ( result_list[ 0 ].error_msg ) {
      result_map = result_list[ 0 ];
      console.log( result_map.error_msg );
      $.gevent.publish( 'localBusiness:read:error', result_map.error_msg );
    }
    else {
      result_map = result_list[ 0 ].ops[ 0 ];

      localBusiness_map = {
        _id             : result_map._id,
        name            : result_map.name,
        postalCode      : result_map.postalCode,
        addressRegion   : result_map.addressRegion,
        addressLocality : result_map.addressLocality,
        streetAddress   : result_map.streetAddress,
        telephone       : result_map.telephone,
        faxNumber       : result_map.faxNumber,
        openingHours    : result_map.openingHours,
        url             : result_map.url
      };

      stateMap.localBusiness[result_map._id] = localBusiness_map;
      $.gevent.publish( 'localBusiness:create', result_map );
    }

  };

  _publish_localbusiness_update   = function ( result_list ) {
    var result_map = result_list[ 0 ].update_object;

    stateMap.localBusiness[ result_map._id ] = result_map;

    $.gevent.publish( 'localBusiness:update', result_map );
  };

  _publish_localbusiness_destroy   = function ( result_list ) {
    var result_map = result_list[ 0 ].delete_object;

    delete stateMap.localBusiness[ result_map._id ];

    $.gevent.publish( 'localBusiness:destroy', result_map );
  };

  //パブリックメソッド/initModule/開始
  initModule = function () {
    var sio = nb.data.getSio();

    sio.on( 'eventlistread',  _publish_eventlistread  );
    sio.on( 'eventcreate',    _publish_eventcreate    );
    sio.on( 'eventupdate',    _publish_eventupdate    );
    sio.on( 'eventdelete',    _publish_eventdelete    );
    sio.on( 'personread',     _publish_personread     );

    sio.on( 'localBusiness:read',   _publish_localbusiness_read   );
    sio.on( 'localBusiness:create', _publish_localbusiness_create );
    sio.on( 'localBusiness:update', _publish_localbusiness_update );
    sio.on( 'localBusiness:destroy', _publish_localbusiness_destroy );

  };
  //パブリックメソッド/initModule/終了

  //パブリックメソッドを返す
  return {
    initModule    : initModule,
    people        : people,
    person        : person,
    event         : event,
    localBusiness : localBusiness
  };
  //------ パブリックメソッド終了 ---------------
}());
