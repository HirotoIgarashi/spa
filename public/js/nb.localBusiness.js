/*
 * nb.localBusiness.js
 * localBusiness ローカルビジネスのviewとcontroller
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
    onClickEdit,
    onClickDestroy,
    onLocalBusinessReadError,
    onLocalBusinessRead,
    onLocalBusinessCreate,
    onLocalBusinessUpdate,
    onLocalBusinessDestroy,
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

      jqueryMap = {
        $container  : $container,
        $form       : $container.find( '#create-localBusiness-form' )
      };
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
          local_business_map;

      for ( object_key in result_map ) {
        if ( result_map.hasOwnProperty( object_key ) ) {
          local_business_map = {
            "_id"             : result_map[ object_key ]._id,
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
          appendLocalBusinessMicrodata( local_business_map );
        }
      }
    };
    //DOMメソッド/makeLocalBusinessMicrodataHtml/終了

    //DOMメソッド/appendLocalBusinessMicrodata/開始
    appendLocalBusinessMicrodata = function ( local_business_map ) {
      var src = $('#localBusiness-microdata-template').text(),
          compiled = dust.compile( src, 'localBusinessMicrodata' );

      // Register the template with Dust
      dust.loadSource( compiled );

      dust.render( 'localBusinessMicrodata', local_business_map, function ( err, out ) {
        if ( $('#local-business [data-id="' + local_business_map._id + '"]').length === 0 ) {
          $( '#local-business' ).append( out );
        }
        else {
          $('#local-business [data-id="' + local_business_map._id + '"]')
            .replaceWith( out );
        }

        $( '#local-business' )
          .find( '[data-id="' + local_business_map._id + '" ]' )
          .find( '.localBusiness-edit' )
          .on( 'click', onClickEdit );
        $( '#local-business' )
          .find( '[data-id="' + local_business_map._id + '" ]' )
          .find( '.localBusiness-remove' )
          .on( 'click', onClickDestroy );
        $.gevent.publish( 'localBusiness:viewComplete', local_business_map._id );
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
      // 入力フィールドの値をクリアする。
      $('#create-localBusiness-form').find(':text').val('');
      $('#create-localBusiness-form').attr( 'data-id', '' );

      // 入力フィールドを非表示にする。
      $('.localBusiness-plus').show();
      $('.localBusiness-minus').hide();
      $('#create-localBusiness-form').hide();
    };

    onClickCreatesubmit = function ( event ) {
      var $form,
          form_id,
          local_business_array,
          local_business_map = {};

      event.preventDefault();

      $form = $(event.target);

      local_business_array = $form.serializeArray();

      local_business_map = nb.model.localBusiness.makeLocalBusiness( local_business_array );

      //form_id = event.currentTarget.getAttribute( 'data-id' );
      form_id = event.target.getAttribute( 'data-id' );

      if ( form_id ) {
        local_business_map._id = form_id;
        nb.model.localBusiness.update( local_business_map );
      }
      else {
        local_business_map._id = null;
        nb.model.localBusiness.create( local_business_map );
      }
      // メッセージフィールドをクリアする。
      $('#localBusiness-msg').empty();

      // 入力フィールドを非表示にする。
      onClickMinus();

      return false;
    };

    onClickEdit = function ( event ) {
      var local_business_list;

      local_business_list = nb.model.localBusiness.read( { _id: event.currentTarget.parentElement.parentElement.getAttribute( 'data-id' ) } );

      jqueryMap.$form.show();
      $( '.glyphicon-plus'  ).hide();
      $( '.glyphicon-minus' ).show();

      $( '#create-localBusiness-form input#name' )
        .val( local_business_list[ 0 ].name );
      $( '#create-localBusiness-form input#postalCode' )
        .val( local_business_list[ 0 ].postalCode );
      $( '#create-localBusiness-form input#addressRegion' )
        .val( local_business_list[ 0 ].addressRegion );
      $( '#create-localBusiness-form input#addressLocality' )
        .val( local_business_list[ 0 ].addressLocality );
      $( '#create-localBusiness-form input#streetAddress' )
        .val( local_business_list[ 0 ].streetAddress );
      $( '#create-localBusiness-form input#telephone' )
        .val( local_business_list[ 0 ].telephone );
      $( '#create-localBusiness-form input#faxNumber' )
        .val( local_business_list[ 0 ].faxNumber );
      $( '#create-localBusiness-form input#openingHours' )
        .val( local_business_list[ 0 ].openingHours );
      $( '#create-localBusiness-form input#url' )
        .val( local_business_list[ 0 ].url );

      $( '#create-localBusiness-form' )
        .attr( 'data-id', local_business_list[ 0 ]._id );

      // ボタンの名称を変更する。
      $( '#create-local-business-button' ).text( '変更' );
    };

    onClickDestroy = function ( event ) {
      var local_business_map,
          local_business_id = event.currentTarget.parentElement.parentElement.getAttribute( 'data-id' );

      local_business_map = nb.model.localBusiness.read({ _id: local_business_id });
      nb.model.localBusiness.destroy( local_business_map );
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

    onLocalBusinessUpdate = function ( event, result_map ) {
      appendLocalBusinessMicrodata( result_map );
    };

    onLocalBusinessDestroy = function ( event, result_map ) {
      $( ' #local-business [data-id="' + result_map._id + '"]' )
        .remove();
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
    initModule = function( $container, callback ) {
            
      if ( ! jqueryMap.$container ) {

        // LocalBusiness用のHTMLを生成して表示する。
        makeLocalBusinessHtml( $container );
        
        // サーバからデータをfetchする。
        // onLocalBusinessReadが呼ばれる
        nb.model.localBusiness.fetch();

        $( '#create-localBusiness-form' ).submit( onClickCreatesubmit );


        $.gevent.subscribe( $container,
                            'localBusiness:read:error',
                            onLocalBusinessReadError );

        $.gevent.subscribe( $container,
                            'localBusiness:read',
                            onLocalBusinessRead );

        $.gevent.subscribe( $container,
                            'localBusiness:create',
                            onLocalBusinessCreate );

        $.gevent.subscribe( $container,
                            'localBusiness:update',
                            onLocalBusinessUpdate );

        $.gevent.subscribe( $container,
                            'localBusiness:destroy',
                            onLocalBusinessDestroy );
      }

      setJqueryMap();

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
