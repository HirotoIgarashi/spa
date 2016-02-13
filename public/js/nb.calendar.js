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
      $container  : null,
      person      : null,
      event       : null
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
    setCalendar,
    makeEventForm,
    fetchEvent,
    onClickButton,
    onTapDate,
    onTapAddEvent,
    onEventcreate,
    onEventlistupdate;

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

    //ユーティリティメソッド/fetchEvent/開始 -----------
    fetchEvent = function ( year, month ) {
      stateMap.person = nb.model.person.read();

      //nb.model.event.readList( { id : stateMap.person._id });
      nb.model.event.fetchRemote( { id : stateMap.person._id });
      
    };
    //ユーティリティメソッド/fetchEvent/終了 -----------

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    //DOMメソッド/makeCalendarHtml/開始
    makeCalendarHtml = function( year, month ) {
      var documnetFragment,
          i,
          $class_col_sm_4      = $('<div/>').addClass( 'col-sm-4'       ),
          $class_header        = $('<div/>').addClass( 'header'         ),
          $class_calendar_body = $('<div/>').addClass( 'calendar-body'  ),
          $class_pager         = $('<ul/>') .addClass( 'pager'          ),
          $class_row_weekdays  = $('<div/>').addClass( 'row weekdays'   ),
          $class_row_dates     = $('<div/>').addClass( 'row dates'      ),
          $row_dates,
          date_list,
          next_month,
          previous_month;

      // 月のリストを得る
      date_list = getCalendarList( year, month );

      // 先月を求める
      previous_month = getPreviousMonth( year, month );
      // 翌月を求める
      next_month = getNextMonth( year, month );

      // documentフラグの作成
      documnetFragment = $( document.createDocumentFragment() );

      // ヘッダーの表示 header, pager
      $('<li/>')
        .addClass( 'previous' )
        .append( '<a><span class="glyphicon glyphicon-chevron-left pull-left"/></a>' )
        .bind('utap',
              {
                year: previous_month.format( 'YYYY' ),
                month: previous_month.format( 'MM' )
              },
              onClickButton
             )
        .appendTo( $class_pager );

      $('<li/>')
        .append( year + "年" + month + "月" )
        .appendTo( $class_pager );

      $('<li/>')
        .addClass( 'next' )
        .bind(  'utap',
                {
                  year  : next_month.format( 'YYYY' ),
                  month : next_month.format( 'MM' )
                },
                onClickButton
             )
        .append('<a><span class="glyphicon glyphicon-chevron-right pull-right"/></a>')
        .appendTo( $class_pager );

      $class_pager.appendTo( $class_header );

      // 曜日の表示 calendar-body, row weekdays
      for ( i = 0; i < 7; ++i ) {
        $('<div/>')
          .addClass( 'col-xs-1' )
          .append( $('<p>' + date_list[i].format('ddd') + '</p>') )
          .appendTo( $class_row_weekdays );
      }

      $class_row_weekdays
        .appendTo( $class_calendar_body );

      // 日付の表示 calendar-body, row dates * 5 | 6
      for ( i = 0; i < date_list.length; ++i ) {
        if ( i % 7 === 0 ) {
          $row_dates = $class_row_dates.clone();
        }

        if ( i % 7 === 6 ) {
          $row_dates
            .appendTo( $class_calendar_body );
        }

        if ( date_list[i].format( 'MM' ) === month ) {
          // 日付を表示する。
          $('<div data-date="' + date_list[i].format('YYYY-MM-DD') + '"/>')
            .addClass( 'col-xs-1' )
            .append( $('<ul><li>' + date_list[i].format( 'DD' ) + '</li></ul>'))
            //
            .html( $('<ul><li>' + date_list[i].format( 'DD' ) + '</li></ul>'))
            .bind(  'utap',
                    {
                      year  : year,
                      month : month,
                      date  : date_list[i].format( 'DD' )
                    },
                    onTapDate
                 )
            .appendTo( $row_dates );
        }
        else {
          $('<div class="col-xs-1"/>')
            .append( $('<p class="inactive">' + date_list[i].format( 'DD' ) + '</p>') )
            .appendTo( $row_dates );
        }
      }

      // 区切り線の表示
      $('<div/>')
        .addClass( 'line' )
        .appendTo( $class_calendar_body );

      // 今日の日付の表示部分
      $('<div/>')
        .addClass( 'current-date' )
        .appendTo( $class_calendar_body );

      $class_header
        .appendTo( $class_col_sm_4 );
      $class_calendar_body
        .appendTo( $class_col_sm_4 );

      $class_col_sm_4.appendTo( documnetFragment );

      return documnetFragment;
    };
    //DOMメソッド/makeCalendarHtml/終了

    //DOMメソッド/setCalendar/開始
    setCalendar = function ( year, month ) {

      jqueryMap.$row
        .html( makeCalendarHtml( year, month ) );

      fetchEvent( year, month );
    };
    //DOMメソッド/setCalendar/終了
    //DOMメソッド/makeEventForm/開始
    makeEventForm = function( dateData ) {
      var documnetFragment,
          $class_col_sm_8    = $('<div class="col-sm-8"></div>'),
          $horizontalForm    = $('<form id="addEventForm" class="form-horizontal"></form>'),
          $form_group_name   = $('<div class="form-group"></div>'),
          $form_group_date   = $('<div class="form-group"></div>'),
          $form_group_place  = $('<div class="form-group"></div>'),
          $form_group_submit = $('<div class="form-group"></div>');

      documnetFragment = $( document.createDocumentFragment() );

      // イベント名
      $('<label for="name" class="col-sm-2 control-label">イベント名:</label>')
        .appendTo( $form_group_name );

      $('<div class="col-sm-10"><input type="text" class="form-control" id="name" placefolder="イベント名" required/></div>')
        .appendTo( $form_group_name );

      // 日時
      $('<label for="startDate" class="col-sm-2 control-label">日時:</label>')
        .appendTo( $form_group_date );
      $('<div class="col-sm-10"><input type="text" class="form-control" id="startDate" placefolder="日時" value="' + dateData + '"/></div>')
        .appendTo( $form_group_date );

      // 場所
      $('<label for="location" class="col-sm-2 control-label">場所:</label>')
        .appendTo( $form_group_place );
      $('<div class="col-sm-10"><input type="text" class="form-control" id="location" placefolder="場所"/></div>')
        .appendTo( $form_group_place );

      // Submit
      $('<div class="col-sm-offset-2 col-sm-10"><button id="addEventButton" submit" class="btn btn-default">保存</buttondiv>')
        .appendTo( $form_group_submit );

      $form_group_name.clone().appendTo( $horizontalForm );
      $form_group_date.clone().appendTo( $horizontalForm );
      $form_group_place.clone().appendTo( $horizontalForm );
      $form_group_submit.clone().appendTo( $horizontalForm );


      $horizontalForm
        .submit( onTapAddEvent )
        .clone( true )
        .appendTo( $class_col_sm_8 );
      $('<div id="result-text"/>').appendTo( $class_col_sm_8 );

      $( $class_col_sm_8 ).appendTo( documnetFragment );

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
        $form_horizontal  : $container.find( '.form-horizontal' ),
        $col_sm_8         : $container.find( '.col-sm-8' ),
        $result_text      : $container.find( '#result-text' )
      };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    onClickButton= function( event ) {
      var currentDate = getCurrentDate(),
          year        = event.data.year,
          month       = event.data.month;

      setCalendar( year, month );

      $('.current-date')
        .append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

      setJqueryMap();

      return false;
    };

    // onTapDate
    onTapDate = function( event ) {
      if ( jqueryMap.$col_sm_8 ) {
        jqueryMap.$col_sm_8.remove();
      }
      jqueryMap.$row
        .append(
          makeEventForm( event.target.getAttribute( 'data-date' ) )
          );

      setJqueryMap();
    };
    // onTapAddEvent
    onTapAddEvent = function( event ) {
      var event_map = {};

      event.preventDefault();

      stateMap.person = nb.model.person.read();

      event_map = {
        person_id : stateMap.person._id,
        name      : $('#name').val(),
        startDate : $('#startDate').val(),
        location  : $('#location').val()
      };

      // イベントの登録
      nb.model.event.create( event_map );

      return false;
    };

    // event-create-completeイベントが発生したときの処理
    // event.type : 'event-create-complete'が返る
    onEventcreate = function ( event, result ) {
      if ( result.error_msg ) {
        jqueryMap.$result_text.text( result.error_msg );
      }
      else {
        jqueryMap.$result_text.text( 'イベントが' + result.result.ok + '件追加されました。' + event.type );
      }

      setTimeout( function () {
        //jqueryMap.$form_horizontal.remove();
        jqueryMap.$col_sm_8.remove();
        jqueryMap.$result_text.remove();
      }, 3000);
    };
    // eventlist-read-completeイベントが発生したときの処理
    // event.type : 'eventlist-read-complete'が返る
    //
    onEventlistupdate = function ( event, result_map ) {
      var id;

      //console.log( result_map );
      for ( id in result_map ) {
        //console.log( result_map[ id ].startDate );
        //console.log( $('.calendar-body [data-date="2016-02-11"] ul') );
        $('.calendar-body [data-date=' + result_map[ id ].startDate + '] ul')
          .append( '<li>' + result_map[ id ].name + '</li>' ); 
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
      moment.locale('ja');

      var currentDate   = getCurrentDate(),
          currentYear   = currentDate.format( 'YYYY' ),
          currentMonth  = currentDate.format( 'MM' );

      stateMap.container = $container;

      if ($container.find('.container-fluid').length === 0) {
        $container
          .append( $('<div class="container-fluid"><div id="row" class="row"></div></div>') );
        setJqueryMap();

        setCalendar( currentYear, currentMonth );

        $('.current-date')
          .append( currentDate.format( 'YYYY年MM月DD日dddd' ) );
      }

      $.gevent.subscribe( $container, 'eventcreate', onEventcreate );
      $.gevent.subscribe( $container, 'eventlistupdate', onEventlistupdate );

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
