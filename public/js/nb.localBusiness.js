/*
 * nb.localBusiness.js
 * localBusiness 場所を処理するモジュール
*/

/*jslint        browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true, unparam : true
*/

/*global $, dust, nb */

nb.localBusiness = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap,
    configModule,
    initModule,
    onClickPlus,
    onClickMinus,
    onClickCreatesubmit,
    onLocalBusinessReadError,
    onLocalBusinessRead,
    onLocalBusinessCreate,
    makeLocalBusinessHtml,
    makeLocalBusinessMicrodataHtml,
    appendLocalBusinessMicrodata;

    //------ モジュールスコープ変数終了 -----------

    //------ ユーティリティメソッド開始 -----------
    // 例: getTrimmedString

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    //DOMメソッド/setJqueryMap/開始

    setJqueryMap = function() {
      var $container = stateMap.container;

      jqueryMap = { $container: $container };
    };
    //DOMメソッド/setJqueryMap/終了

    //DOMメソッド/makeLocalBusinessHtml/開始
    makeLocalBusinessHtml = function ( $container ) {
      var src,
          compiled;

      src = $('#localBusiness-template').text();
      compiled = dust.compile( src, 'localBusiness' );

      // Register the template with Dust
      dust.loadSource( compiled );

      stateMap.container = $container;
      setJqueryMap();

      // Render the template
      //dust.render( 'localBusiness', { world : "Earth" }, function ( err, out ) {
      dust.render( 'localBusiness', {}, function ( err, out ) {
        jqueryMap.$container.html( out );
      });

      $('.localBusiness-minus').hide();
      $('#create-localBusiness-form').hide();

      $('.localBusiness-plus').on( 'click', onClickPlus );
      $('.localBusiness-minus').on( 'click', onClickMinus );
    };
    //DOMメソッド/makeLocalBusinessHtml/終了

    //DOMメソッド/makeLocalBusinessMicrodataHtml/開始
    makeLocalBusinessMicrodataHtml = function ( result_map ) {
      var object_key,
          localbusiness_map;

      for ( object_key in result_map ) {
        if ( result_map.hasOwnProperty( object_key ) ) {
          localbusiness_map = {
            "name"            : result_map[ object_key ].name,
            "postalCode"      : result_map[ object_key ].postalCode,
            "addressRegion"   : result_map[ object_key ].addressRegion,
            "addressLocality" : result_map[ object_key ].addressLocality,
            "streetAddress"   : result_map[ object_key ].streetAddress,
            "faxNumber"       : result_map[ object_key ].faxNumber,
            "telephone"       : result_map[ object_key ].telephone,
            "openingHours"    : result_map[ object_key ].openingHours,
            "url"             : result_map[ object_key ].url
          };

          // Render the template
          appendLocalBusinessMicrodata( localbusiness_map );
        }
      }
    };
    //DOMメソッド/makeLocalBusinessMicrodataHtml/終了

    //DOMメソッド/appendLocalBusinessMicrodata/開始
    appendLocalBusinessMicrodata = function ( localbusiness_map ) {
      var src = $('#localBusiness-microdata-template').text(),
          compiled = dust.compile( src, 'localBusinessMicrodata' );

      // Register the template with Dust
      dust.loadSource( compiled );

      dust.render( 'localBusinessMicrodata', localbusiness_map, function ( err, out ) {
        $( '#local-business' ).append( out );
      });
    };
    //DOMメソッド/appendLocalBusinessMicrodata/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    onClickPlus = function () {
      $('.localBusiness-plus').hide();
      $('.localBusiness-minus').show();
      $('#create-localBusiness-form').show();
    };
    onClickMinus = function () {
      $('.localBusiness-plus').show();
      $('.localBusiness-minus').hide();
      $('#create-localBusiness-form').hide();
    };

    onClickCreatesubmit = function ( event ) {
      var localbusiness_map;

      event.preventDefault();

      localbusiness_map = {
        name            : $( '#name'            ).val(),
        postalCode      : $( '#postalCode'      ).val(),
        addressRegion   : $( '#addressRegion'   ).val(),
        addressLocality : $( '#addressLocality' ).val(),
        streetAddress   : $( '#streetAddress'   ).val(),
        telephone       : $( '#telephone'       ).val(),
        faxNumber       : $( '#faxNumber'       ).val(),
        openingHours    : $( '#openingHours'    ).val(),
        url             : $( '#url'             ).val()
      };

      nb.model.localBusiness.create( localbusiness_map );
      
      $('#create-localBusiness-form').find(':text').val('');
      /*
      $( '#name'            ).val('');
      $( '#postalCode'      ).val('');
      $( '#addressRegion'   ).val('');
      $( '#addressLocality' ).val('');
      $( '#streetAddress'   ).val('');
      $( '#telephone'       ).val('');
      $( '#faxNumber'       ).val('');
      $( '#openingHours'    ).val('');
      $( '#url'             ).val('');
      */

      return false;
    };

    onLocalBusinessCreate = function ( event, result_map ) {

      appendLocalBusinessMicrodata( result_map );

    };

    onLocalBusinessReadError = function ( event, error_msg ) {
      $('#localBusiness-msg').text( error_msg );
    };

    onLocalBusinessRead = function ( event, result_map ) {

      if ( Object.keys( result_map ).length === 0 ) {
        $('#localBusiness-msg').text( '登録されているデータは0件です。');
      }
      else {
        // Microdataを生成し表示する。
        makeLocalBusinessMicrodataHtml( result_map );
      }

    };
    //------ イベントハンドラ終了 -----------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッド/configModule/開始
    // 目的: 許可されたキーの構成を調整する
    // 引数: 設定可能なキーバリューマップ
    //  * color_name - 使用する色
    // 設定:
    //  * configMap.settable_map 許可されたキーを宣言する
    // 戻り値: true
    // 例外発行: なし
    //
    configModule = function(input_map) {
      nb.butil.setConfigMap({
        input_map     : input_map,
        settable_map  : configMap.settable_map,
        config_map    : configMap
      });
      return true;
    };

    //パブリックメソッド/configModule/終了

    //パブリックメソッド/initModule/開始
    // 目的: モジュールを初期化する
    // 引数:
    //  * $container この機能が使うjQuery要素
    // 戻り値: true
    // 例外発行: なし
    //
    initModule = function( $container ) {
            
      if ( ! jqueryMap.$container ) {

        // LocalBusiness用のHTMLを生成して表示する。
        makeLocalBusinessHtml( $container );
        
        // サーバからデータをfetchする。
        // onLocalBusinessReadが呼ばれる
        nb.model.localBusiness.fetch();

        $( '#create-localBusiness-form' ).submit( onClickCreatesubmit );

        $.gevent.subscribe( $container, 'localBusiness:read:error', onLocalBusinessReadError );
        $.gevent.subscribe( $container, 'localBusiness:read', onLocalBusinessRead );
        $.gevent.subscribe( $container, 'localBusiness:create', onLocalBusinessCreate );
      }

      return true;
    };
    //パブリックメソッド/initModule/終了

    //パブリックメソッドを返す
    return {
      configModule  : configModule,
      initModule    : initModule
    };
    //------ パブリックメソッド終了 ---------------
}());
