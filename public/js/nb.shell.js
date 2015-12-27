/*
 * nb.shell.js
 * note book のシェルモジュール
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

nb.shell = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      main_html     : String()
      + '<h1 style="display:inline-block; margin:25px;">'
        + 'hello world!'
      + '</h1>'
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap,
    initModule;

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
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    //------ イベントハンドラ終了 -----------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッド/initModule/開始
    initModule = function( $container ) {
      stateMap.$container = $container;

      var p, t, frag;

      frag = document.createDocumentFragment();

      p = document.createElement('P');
      t = document.createTextNode('first paragraph');
      p.appendChild(t);
      frag.appendChild(p);

      p = document.createElement('footer');
      t = document.createTextNode('footer');
      p.appendChild(t);
      frag.appendChild(p);

      document.body.appendChild(frag);
      //$container.html( configMap.main_html );
      setJqueryMap();
    };
    //パブリックメソッド/initModule/終了

    //パブリックメソッドを返す
    return {
      initModule    : initModule
    };
    //------ パブリックメソッド終了 ---------------
}());
