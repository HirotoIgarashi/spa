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
    makeEventForm,
    onClickButton,
    onTapDate;

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
          class_col_sm_2      = $('<div class="col-sm-2"></div>'),
          class_wrapper       = $('<div class="wrapper"></div>'),
          class_header        = $('<div class="header"></div>'),
          class_calendar_body = $('<div class="calendar-body"></div>'),
          class_pager         = $('<ul class="pager"></ul>'),
          class_row_weekdays  = $('<div class="row weekdays"></div>'),
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
        .bind( 'utap', { year: previous_month.format( 'YYYY' ), month: previous_month.format( 'MM' ) }, onClickButton )
        .appendTo( class_pager );

      $('<li></li>')
        .append( year + "年" + month + "月" )
        .appendTo( class_pager );

      $('<li class="next"></li>')
        .bind( 'utap', { year: next_month.format( 'YYYY' ), month : next_month.format( 'MM' ) }, onClickButton )
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
            .bind( 'utap', { year: year, month: month, date: date_list[i].format( 'DD' ) }, onTapDate )
            .appendTo( row_dates );
        } else {
          $('<div class="col-xs-1"><p class="inactive">' + date_list[i].format( 'DD' ) + '</p></div>')
            .bind( 'utap', { year: year, month: month, date: date_list[i].format( 'DD' ) }, onTapDate )
            .appendTo( row_dates );
        }
      }

      class_line.appendTo( class_calendar_body );
      class_current_date.appendTo( class_calendar_body );

      class_header.appendTo( class_wrapper );
      class_calendar_body.appendTo( class_wrapper );
      class_wrapper.appendTo( class_col_sm_2 );

      class_col_sm_2.appendTo( documnetFragment );

      return documnetFragment;
    };
    //DOMメソッド/makeCalendarHtml/終了
    //DOMメソッド/makeEventForm/開始
    makeEventForm = function() {
      var documnetFragment,
          class_col_sm_10    = $('<div class="col-sm-10"></div>'),
          horizontalForm    = $('<form class="form-horizontal"></form>'),
          form_group_name   = $('<div class="form-group"></div>'),
          form_group_date   = $('<div class="form-group"></div>'),
          form_group_place  = $('<div class="form-group"></div>'),
          form_group_submit = $('<div class="form-group"></div>');

      documnetFragment = $( document.createDocumentFragment() );

      // イベント名
      $('<label for="inputEventName" class="col-sm-4 control-label">イベント名:</label>')
        .appendTo( form_group_name );

      $('<div class="col-sm-8"><input type="text" class="form-control" id="inputEventName" placefolder="イベント名"/></div>')
        .appendTo( form_group_name );

      // 日時
      $('<label for="inputStartDate" class="col-sm-4 control-label">日時:</label>')
        .appendTo( form_group_date );
      $('<div class="col-sm-8"><input type="text" class="form-control" id="inputStartDate" placefolder="日時"/></div>')
        .appendTo( form_group_date );

      // 場所
      $('<label for="inputPlace" class="col-sm-4 control-label">場所:</label>')
        .appendTo( form_group_place );
      $('<div class="col-sm-8"><input type="text" class="form-control" id="inputPlace" placefolder="場所"/></div>')
        .appendTo( form_group_place );

      // Submit
      $('<div class="col-sm-offset-4 col-sm-8"><button type="submit" class="btn btn-default">保存</buttondiv>')
        .appendTo( form_group_submit );

      form_group_name.clone().appendTo( horizontalForm );
      form_group_date.clone().appendTo( horizontalForm );
      form_group_place.clone().appendTo( horizontalForm );
      form_group_submit.clone().appendTo( horizontalForm );

      horizontalForm.clone().appendTo( class_col_sm_10 );

      $( class_col_sm_10 ).appendTo( documnetFragment );

      return documnetFragment;
    };
    //DOMメソッド/makeEventForm/終了
    //
    //DOMメソッド/setJqueryMap/開始
    setJqueryMap = function() {
      var $container = stateMap.container;

      jqueryMap = {
        $container        : $container,
        $fluid            : $container.find( '.container-fluid' ),
        $row              : $container.find( '#row' ),
        $wrapper          : $container.find( '.wrapper' ),
        $form_horizontal  : $container.find( '.form-horizontal' )
      };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    onClickButton= function( event ) {
      var currentDate = getCurrentDate();

      jqueryMap.$row.html( makeCalendarHtml(
        event.data.year, event.data.month )
      );

      $('.current-date')
        .append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

      setJqueryMap();

      return false;
    };

    // onTapDate
    onTapDate = function( event ) {
      if ( jqueryMap.$form_horizontal.length === 0 ) {
        jqueryMap.$row
          .append(
            makeEventForm(event.data.year,
                          event.data.month,
                          event.data.date )
          );
      }

      setJqueryMap();
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

      if ($container.find('.container-fluid').length === 0) {
        $container
          .append( $('<div class="container-fluid"><div id="row" class="row"></div></div>') );
        setJqueryMap();
        jqueryMap.$row
          .append( makeCalendarHtml(
            currentDate.format( 'YYYY' ),
            currentDate.format( 'MM' )
          ) );
      }

      $('.current-date')
        .append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

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
