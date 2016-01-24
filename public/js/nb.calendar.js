/*
 * module_template.js
 * ブラウザ機能モジュールのテンプレート
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

nb.calendar = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      calendar_html : String()
          + '<div class="wrapper">'
            + '<div class="header">'
              + '<span class="glyphicon glyphicon-chevron-left pull-left"></span>'
              + '<span class="glyphicon glyphicon-chevron-right pull-right"></span>'
              + '<p>January 2016</p>'
            + '</div><!-- end header -->'
            + '<div class="calendar-body">'
              + '<div class="row weekdays">'
                + '<div class="col-xs-1"><p>日</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>月</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>火</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>水</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>木</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>金</p></div><!-- end col-xs-1 -->'
                + '<div class="col-xs-1"><p>土</p></div><!-- end col-xs-1 -->'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">27</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">28</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">29</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">30</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">31</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>1</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>2</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p>3</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>4</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>5</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>6</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>7</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>8</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>9</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p>10</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>11</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>12</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>13</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>14</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>15</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>16</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p>17</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>18</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>19</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>20</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>21</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>22</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>23</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p>24</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>25</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>26</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>27</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>28</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>29</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p>30</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="row dates">'
                + '<div class="col-xs-1"><a href="#"><p>31</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">1</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">2</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">3</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">4</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">5</p></a></div>'
                + '<div class="col-xs-1"><a href="#"><p class="inactive">6</p></a></div>'
              + '</div><!-- end row -->'
              + '<div class="line"></div>'
              + '<div class="current-date">Sunday, January 24</div>'
            + '</div><!-- end calendar-body -->'
          + '</div><!-- end wrapper -->',
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

      jqueryMap = { $container: $container };
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
      setJqueryMap();

      jqueryMap.$container.html( configMap.calendar_html );
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
