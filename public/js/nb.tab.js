/*
 * nb.tab.js
 * ユーザのタブのコントロールnb.tab
 */
/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, nb */

nb.tab = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      tabs_html     : String()
          + '<ul id="myTabs" class="nav nav-tabs" role="tablist">'
            + '<li role="presentation" class=""><a href="#calendar" id="calendar-tab" role="tab" data-toggle="tab" aria-controls="calendar" aria-expanded="true">カレンダー</a></li>'
            + '<li role="presentation" class=""><a href="#paint" id="paint-tab" role="tab" data-toggle="tab" aria-controls="paint" aria-expanded="true">お絵かき</a></li>'
            + '<li role="presentation" class=""><a href="#task" id="task-tab" role="tab" data-toggle="tab" aria-controls="task" aria-expanded="true">Task</a></li>'
            + '<li role="presentation" class=""><a href="#list" id="list-tab" role="tab" data-toggle="tab" aria-controls="list" aria-expanded="true">List</a></li>'
          + '</ul>'
          + '<div id="myTabContent" class="tab-content">'
            + '<div role="tabpanel" class="tab-pane fade" id="calendar" aria-labelledby="calendar-tab">'
            + '</div>'
            + '<div role="tabpanel" class="tab-pane fade" id="paint" aria-labelledby="paint-tab">'
            + '</div>'
            + '<div role="tabpanel" class="tab-pane fade" id="task" aria-labelledby="task-tab">'
            + '</div>'
            + '<div role="tabpanel" class="tab-pane fade" id="list" aria-labelledby="list-tab">'
            + '</div>'
          + '</div>',
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap,
    configModule,
    initModule;

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
        $calendar   : $container.find( '#calendar' ),
        $paint      : $container.find( '#paint' ),
        $task       : $container.find( '#task' ),
        $list       : $container.find( '#list' )
      };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
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
      stateMap.container = $container;

      stateMap.container.html( configMap.tabs_html );

      setJqueryMap();

      $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        switch ( e.target.id ) {
          case 'calendar-tab':
            nb.calendar.initModule( jqueryMap.$calendar );
            break;

          case 'paint-tab':
            nb.paint.initModule( jqueryMap.$paint );
            break;

          case 'task-tab':
            nb.task.initModule( jqueryMap.$task );
            break;

          case 'list-tab':
            nb.list.initModule( jqueryMap.$list );
            break;

        }
      });

      $('#calendar-tab').tab('show');

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
