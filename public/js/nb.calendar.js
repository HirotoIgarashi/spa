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

/*global $ , nb , moment*/

nb.calendar = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      calendar_html : String()
          + '<div class="wrapper">'
            + '<div class="header">'
              + '<span class="glyphicon glyphicon-chevron-left pull-left"></span>'
              + '<span class="glyphicon glyphicon-chevron-right pull-right"></span>'
              + '<p></p>'
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
              + '<div class="current-date"></div>'
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
    initModule,
    getCurrentDate,
    getFirstDate,
    getLastDate,
    getNextMonth,
    getPreviousMonth,
    getCalendarFirstDate,
    getCalendarLastDate,
    getCalendarList,
    makeCalendarHtml,
    onClickButton;

    //------ モジュールスコープ変数終了 -----------

    //------ ユーティリティメソッド開始 -----------
    // 例: getTrimmedString
    //ユーティリティメソッド/getCurrentDate/開始 -----------
    // 現在の日付を得る
    getCurrentDate = function() {
      return moment();
    };
    // ある日付を与えてその月の１日を求める
    getFirstDate = function( date ) {
      return moment( date )
              .date( 1 );
    };
    // ある日付を与えてその月の最終日を求める
    getLastDate = function( date ) {
      return moment( date )
              .date( moment( date ).daysInMonth() );
    };

    // その月の１日を与えてカレンダーの最初の日を求める
    getCalendarFirstDate = function( firstDate ) {
      var backCount;
      backCount = firstDate.format( 'e' );
      return moment( firstDate ).subtract( backCount, 'days' );
    };

    // その月の最後の日を与えてカレンダーの最後の日を求める
    getCalendarLastDate = function( lastDate) {
      var forwardCount;
      forwardCount = 6 - lastDate.format( 'e' );
      return moment( lastDate ).add( forwardCount, 'days' );
    };
    // 次の月を求める
    getNextMonth = function( year, month ) {
      return moment()
        .set({
          'years'   : year,
          'months'  : month - 1
        })
        .add( 1, 'months' );
    };
    // 前の月を求める
    getPreviousMonth = function( year, month ) {
      return moment()
        .set({
          'years'   : year,
          'months'  : month - 1
        })
        .subtract( 1, 'months' );
    };
    // ある月を与えて1月分のリストを得る
    getCalendarList = function(year, month ) {
      var calendarList = [],
          arg_date = moment()
            .set({
              'years'   : year,
              'months'  : month -1
            }),
          first_date,
          last_date,
          list_length,
          n,  // カウンター
          push_data;

      first_date = getCalendarFirstDate( getFirstDate( arg_date ) );

      last_date = getCalendarLastDate( getLastDate( arg_date ) );

      list_length = last_date.diff( first_date, 'days' ) + 1;

      push_data = first_date;

      for ( n = 0; n < list_length; n++ ) {
        calendarList.push( push_data );
        push_data = push_data.clone().add( 1, 'days' );
      }
      return calendarList;
    };

    //ユーティリティメソッド/getCurrentDate/終了 -----------

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    //DOMメソッド/makeCalendarHtml/開始
    makeCalendarHtml = function( year, month ) {
      var documnetFragment,
          i,
          span,
          class_wrapper       = $('<div class="wrapper"></div>'),
          class_header        = $('<div class="header"></div>'),
          class_calendar_body = $('<div class="calendar-body"></div>'),
          class_pager         = $('<ul class="pager"></ul>'),
          tag_p                   = $('<p></p>'),
          class_row_weekdays  = $('<div class="row weekdays"></div>'),
          class_col_xs_1      = $('<div class="col-xs-1"><p></p></div>'),
          class_row_dates     = $('<div class="row dates"></div>'),
          class_line          = $('<div class="line"></div>'),
          class_current_date  = $('<div class="current-date"></div>'),
          weekdays_list       = [ '日', '月', '火', '水', '木', '金', '土' ],
          date_list,
          row_dates,
          next_month,
          previous_month;

      // 月のリストを得る
      date_list = getCalendarList( year, month );

      // 先月を求める
      previous_month = getPreviousMonth( year, month );
      // 翌月を求める
      next_month = getNextMonth( year, month );

      documnetFragment = $( document.createDocumentFragment() );

      // ヘッダーの表示

      $('<li class="previous"></li>')
        .append('<a><span class="glyphicon glyphicon-chevron-left pull-left"></span></a>')
        .bind( 'click', { year: previous_month.format( 'YYYY' ), month: previous_month.format( 'MM' ) }, onClickButton )
        .appendTo( class_pager );

      $('<li></li>')
        .append( year + "年" + month + "月" )
        .appendTo( class_pager );

      $('<li class="next"></li>')
        .bind( 'click', { year: next_month.format( 'YYYY' ), month : next_month.format( 'MM' ) }, onClickButton )
        .append('<a><span class="glyphicon glyphicon-chevron-right pull-right"></span></a>')
        .appendTo( class_pager );

      class_pager.appendTo( class_header );

      // 曜日の表示
      for ( i = 0; i < 7; ++i ) {
        $('<div class="col-xs-1"><p>' + weekdays_list[i] + '</p></div>')
          .appendTo( class_row_weekdays );
      }

      class_row_weekdays.appendTo( class_calendar_body );

      // 日付の表示
      for ( i = 0; i < date_list.length; ++i ) {
        if ( i % 7 === 0 ) {
          row_dates = class_row_dates.clone();
        }
        if ( i % 7 === 6 ) {
          row_dates.appendTo( class_calendar_body );
        }
        if ( date_list[i].format( 'MM' ) === month ) {
          $('<div class="col-xs-1"><p>' + date_list[i].format( 'DD' ) + '</p></div>')
            .appendTo( row_dates );
        } else {
          $('<div class="col-xs-1"><p class="inactive">' + date_list[i].format( 'DD' ) + '</p></div>')
            .appendTo( row_dates );
        }
      }

      class_line.appendTo( class_calendar_body );
      class_current_date.appendTo( class_calendar_body );

      class_header.appendTo( class_wrapper );
      class_calendar_body.appendTo( class_wrapper );

      class_wrapper.appendTo( documnetFragment );

      return documnetFragment;
    };
    //DOMメソッド/makeCalendarHtml/終了
    //
    //DOMメソッド/setJqueryMap/開始
    setJqueryMap = function() {
      var $container = stateMap.container;

      jqueryMap = { $container: $container };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    onClickButton= function( event ) {
      var currentDate = getCurrentDate();

      jqueryMap.$container.html( makeCalendarHtml(
        event.data.year, event.data.month )
      );

      $('.current-date').append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

      return false;
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
      moment.locale('ja');

      var currentDate = getCurrentDate();

      stateMap.container = $container;
      setJqueryMap();

      jqueryMap.$container.html( makeCalendarHtml(
        currentDate.format( 'YYYY' ),
        currentDate.format( 'MM' )
        )
      );

      $('.current-date').append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

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
