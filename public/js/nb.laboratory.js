/*
 * nb.laboratory.js
 * 研究室
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb, WebSocket */

nb.laboratory = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    list_html = String()
      + '<div class="container">'
        + '<h1>武器を選択してください</h1>'
        + '<p>'
        + 'あなたのキャラクターの詳細情報を調べるために下にある選択肢の1つをクリックしてください。'
        + '</p>'
        + '<ul id="myList">'
          + '<li data-description="王国内でもっとも強いゴブリン">'
          + 'ルド</li>'
          + '<li data-description="大小関わらずすべてのゴブリンの支配者">'
          + 'ゴブリンの王ジャレス</li>'
          + '<li data-description="ゴブリンの王に待ったをかけられる唯一の人">'
          + 'サラ</li>'
          + '<li data-description="ゴブリン王国の称賛されていない英雄">'
          + 'ホグル</li>'
        + '</ul>'
        + '<p id="displayTarg" class="well"></p>'
      + '</div> <!-- /container -->',
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
    makeHtml,
    WebSocketDemo;

    //------ モジュールスコープ変数終了 -----------

    //------ ユーティリティメソッド開始 -----------
    // 例: getTrimmedString

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    //DOMメソッド/makeHtml/開始
    makeHtml = function() {
      var documentFragment;

      documentFragment = $( document.createDocumentFragment() );

      documentFragment.append( $('<h2>WebSocketテスト</h2><div id="output"></div>') );

      documentFragment.append( $( '<form name="dateSelection">出発日を入力してください: <input type="date" name="departingDate" /></form>' ) );
      
      documentFragment.append( $( '<form name="myForm">靴のサイズ: <input type="range" name="shoeSize" min="0" max="15" step=".5" value="3" /><input type="submit" /></form>' ) );

      documentFragment.append( $( '<form name="myForm">30%: <meter value="3" min="0" max="10"></meter><br />30%: <meter value="0.3" low="0.4">30%</meter></form>' ) );
      documentFragment.append( $( '<form name="myForm">ダウンロード進捗状況: <progress value="35" max="100"></progress></form>' ) );
      documentFragment.append( $( '<input id="myInput" type="text" placeholder="テキストを入力">' ) );

      documentFragment
        .append( $( '<form name="newForm">1から5の数を何でもいいので入力してください。<input type="number" name="quantity" min="1" max="5" /><br /><input type="submit" name="mySubmit" /></form>' ) );

      documentFragment.append (list_html);

      return documentFragment;
    };
    //DOMメソッド/makeHtml/終了
    //DOMメソッド/setJqueryMap/開始

    setJqueryMap = function() {
      var $container = stateMap.container;

      jqueryMap = { $container: $container };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    //------ イベントハンドラ終了 -----------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッド/WebSocketDemo/開始
    WebSocketDemo = (function() {
      return {
        ws      : null,
        init    : function( url ) {
          this.ws = new WebSocket( url );
          this.onOpen();
          this.onMessage();
          this.onClose();
        },

        onOpen  : function() {
          this.ws.onopen = function( evt ) {
            console.log( '接続: ' + evt.type );
            WebSocketDemo.ws.send( 'html5 hacks' );
          };
        },

        onClose : function() {
          this.ws.onclose = function( evt ) {
            console.log( '接続終了: ' + evt.type );
          };
        },

        onMessage : function () {
          this.ws.onmessage = function( evt ) {
            console.log( 'レスポンス: ' + ' : ' + evt.data );
            WebSocketDemo.ws.close();
          };
        }
      };
    }());
    //パブリックメソッド/WebSocketDemo/終了

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
      var mainElement,
          descriptionTarget,
          description;

      stateMap.container = $container;
      setJqueryMap();

      jqueryMap.$container.html( makeHtml() );

      document.getElementById('myInput')
        .addEventListener('input', function( e ) {
          console.log( "次の入力をしました:", e.target );
        }, false );

      document.newForm.quantity.addEventListener('input', function () {
          this.checkValidity();
        }, false );

      document.newForm.quantity.addEventListener('invalid', function () {
          alert('選んだ数は1と5の間である必要があります。あなたは、' + this.value + ' を選びました。');
        }, false );

      mainElement = document.getElementById('myList');
      descriptionTarget = document.getElementById('displayTarg');

      mainElement.addEventListener( 'click', function( e ) {
        description = e.target.getAttribute('data-description');
        descriptionTarget.innerHTML = description;
      }, false );

      WebSocketDemo.init("wss://echo.websocket.org/");
      //WebSocketDemo.init("wss://localhost/");

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
