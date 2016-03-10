/*
 * nb.calendar.js
 * カレンダー機能
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
      color_name    : 'blue',
      menu_html : String()
        + '<ul class="nav nav-pills">'
          + '<li role="presentation" class="dropdown">'
            + '<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">'
            + '設定<span class="caret"></span>'
            + '</a>'
            + '<ul class="dropdown-menu">'
            + '</ul>'
          + '</li>'
        + '</ul>',
        event_form_html  : String()
            + '<div class="col-sm-8">'
              + '<h4 id="select-date" />'
              + '<p id="event-exist" />'
              + '<div id="div-event-table">'
              + '</div>'
              + '<a>'
                + '<span class="glyphicon glyphicon-plus">'
                + '</span>'
              + '</a>'
              + '<a>'
                + '<span class="glyphicon glyphicon-minus">'
                + '</span>'
              + '</a>'
              + '<div id="div-add-event-form">'
              + '</div>'
            + '</div>',
        eventtable_html  : String()
          + '<table id="event-table">'
            + '<tbody id="event-tbody">'
              + '<tr>'
                + '<th>イベント名</th>'
                + '<th>開始日時</th>'
                + '<th>場所</th>'
                + '<th>編集</th>'
                + '<th>削除</th>'
              + '</tr>'
            + '</tbody>'
          + '</table>'
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
    setCalendar,
    fetchEvent,
    makeCalendarHtml,
    makeEventTable,
    makeEventTr,
    makeEventForm,
    onClickButton,
    onClickDate,
    onClickAddEvent,
    onEventcreate,
    onEventupdate,
    onEventlistupdate,
    onClickEdit,
    onClickDestroy,
    onEventDelete,
    onClickLocalBusiness,
    onLocalBusinessViewComplete;

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
      return moment( date ).date( 1 );
    };
    // ある日付を与えてその月の最終日を求める
    getLastDate = function( date ) {
      return moment( date )
              .date( moment( date ).daysInMonth() );
    };

    // その月の１日を与えてカレンダーの最初の日を求める
    getCalendarFirstDate = function( firstDate ) {
      var backCount = 6;

      // 日曜日始まり
      //backCount = firstDate.format( 'e' );  // 月曜日は"1"が返る
      // 月曜日始まり
      if ( firstDate.format( 'e' ) !== '0' ) {
        backCount = firstDate.format( 'e' ) - 1;  // 月曜日は"1"が返る
      }
      return moment( firstDate ).subtract( backCount, 'days' );
    };

    // その月の最後の日を与えてカレンダーの最後の日を求める
    getCalendarLastDate = function( lastDate) {
      var forwardCount = 0;
      // 日曜日始まり
      //forwardCount = 6 - lastDate.format( 'e' );
      // 月曜日始まり
      if ( lastDate.format( 'e' ) !== '0' ) {
        forwardCount = 7 - lastDate.format( 'e' );
      }
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
          $date,
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
        .on('click',
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
        .on(  'click',
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

        // 今月の処理
        if ( date_list[i].format( 'MM' ) === month ) {
          // 日付を表示する。
          $date = $('<div data-date="' + date_list[i].format('YYYY-MM-DD') + '" type="button" />');
          $date
            .addClass( 'col-xs-1' )
            .on(
              'click',
              {
                year  : year,
                month : month,
                date  : date_list[i].format( 'DD' )
              },
              onClickDate
            );

          $date
            .html( $('<p>' + date_list[i].format( 'DD' ).replace( /^0+([0-9]+.*)/, '$1' ) + '</p>'))
            .append( $('<ul />') );

          $date.appendTo( $row_dates );
        }
        // 先月が翌月
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
          $horizontalForm    = $('<form id="addEventForm" class="form-horizontal"></form>'),
          $form_group_name      = $('<div class="form-group"></div>'),
          $form_group_startDate = $('<div class="form-group"></div>'),
          $form_group_startTime = $('<div class="form-group"></div>'),
          $form_group_endDate   = $('<div class="form-group"></div>'),
          $form_group_endTime   = $('<div class="form-group"></div>'),
          $form_group_location  = $('<div class="form-group"></div>'),
          $form_group_submit    = $('<div class="form-group"></div>');

      documnetFragment = $( document.createDocumentFragment() );

      // イベント名
      $('<label for="name" class="col-sm-2 control-label">イベント名:</label>')
        .appendTo( $form_group_name );

      $('<div class="col-sm-10"><input type="text" class="form-control" id="name" placefolder="イベント名" required/></div>')
        .appendTo( $form_group_name );

      // 開始日
      $('<label for="startDate" class="col-sm-2 control-label">開始日:</label>')
        .appendTo( $form_group_startDate );
      $('<div class="col-sm-10"><input type="date" class="form-control" id="startDate" placefolder="開始日" value="' + dateData + '" required/>')
        .appendTo( $form_group_startDate );
      // 開始時間
      $('<label for="startTime" class="col-sm-2 control-label">開始時間:</label>')
        .appendTo( $form_group_startTime );
      $('<div class="col-sm-10"><input type="time" class="form-control" id="startTime" placefolder="時間"/>')
        .appendTo( $form_group_startTime );

      // 終了日
      $('<label for="startDate" class="col-sm-2 control-label">終了日:</label>')
        .appendTo( $form_group_endDate );
      $('<div class="col-sm-10"><input type="date" class="form-control" id="endDate" placefolder="終了日" />')
        .appendTo( $form_group_endDate );
      // 終了時間
      $('<label for="endTime" class="col-sm-2 control-label">終了時間:</label>')
        .appendTo( $form_group_endTime );
      $('<div class="col-sm-10"><input type="time" class="form-control" id="endTime" placefolder="終了時間"/>')
        .appendTo( $form_group_endTime );

      // 場所
      $('<label for="location" class="col-sm-2 control-label">場所:</label>')
        .appendTo( $form_group_location );
      $('<div class="col-sm-10"><input type="text" class="form-control" id="location" placefolder="場所" disabled /></div>')
        .appendTo( $form_group_location );

      // Submit
      $('<div class="col-sm-offset-2 col-sm-10"><button id="addEventButton"  class="btn btn-default">追加</button></div>')
        .appendTo( $form_group_submit );

      $form_group_name.clone().appendTo( $horizontalForm );
      $form_group_startDate.clone().appendTo( $horizontalForm );
      $form_group_startTime.clone().appendTo( $horizontalForm );
      $form_group_endDate.clone().appendTo( $horizontalForm );
      $form_group_endTime.clone().appendTo( $horizontalForm );
      $form_group_location.clone().appendTo( $horizontalForm );

      // localBusinessを追加するボタン
      $('<button type="button" id="localBusiness">ローカルビジネスから選択</button>')
        .on( 'click', onClickLocalBusiness )
        .clone( true )
        .appendTo( $horizontalForm );

      $form_group_submit.clone().appendTo( $horizontalForm );


      $horizontalForm
        .submit( onClickAddEvent )
        .clone( true );

      $('<div id="result-text"/>').appendTo( $horizontalForm );

      $( $horizontalForm ).appendTo( documnetFragment );
      $( '<div id="localBusiness-area" />' ).appendTo( documnetFragment );


      return documnetFragment;
    };
    //DOMメソッド/makeEventForm/終了

    onClickLocalBusiness = function ( event ) {
      nb.localBusiness.initModule( $('#localBusiness-area') );
    };
    
    onLocalBusinessViewComplete = function( event, id ) {
      var name;
      console.log( 'onClickLocalBusiness: ' + id );
      $( '[data-id="' + id + '"]' ).on( 'click', function( event ) {
        name = $( '[data-id="' + id + '"]' ).find( '[itemprop="name"]' ).text();
        console.log( name );
        $( '#location' ).val( name );
      });
    };
    //DOMメソッド/makeEventTable/開始
    makeEventTable = function ( dateData ) {
      var i,
          return_data,
          event_data,
          $tr,
          $event_table;

      event_data = nb.model.event.read( { startDate: dateData.split( 'T' )[ 0 ] } );

      if ( event_data.length === 0 ) {
        return_data = null;
      }
      else {
        $event_table = $( configMap.eventtable_html );

        for ( i = 0; i < event_data.length; ++i ) {
          $tr = makeEventTr( event_data[ i ] );
          $event_table
            .append( $tr );
        }
        return_data = $event_table;
      }

      return return_data;
    };
    //DOMメソッド/makeEventTable/終了
    //DOMメソッド/makeEventTr/開始
    makeEventTr = function( event_item ) {
      var $tr,
          $td_name,
          $td_startDate,
          $td_location,
          $td_edit,
          $button_edit,
          $span_edit,
          $td_remove,
          $button_remove,
          $span_remove,
          startDate,
          startTime;

      startDate = event_item.startDate.split( 'T' )[ 0 ];
      startTime = event_item.startDate.split( 'T' )[ 1 ] || '';

      $tr = $( '<tr data-id="' + event_item._id + '"></tr>' );

      $td_name      = $( '<td data-id="name">' + event_item.name + '</td>' );
      $td_startDate = $( '<td data-id="startDate">' + startDate + ' ' + startTime + '</td>' );
      $td_location  = $( '<td data-id="location">' + event_item.location + '</td>' );
      $td_edit      = $( '<td class="editbutton"></td>' );

      $button_edit  = $( '<button data-id="' + event_item._id + '" id="event-edit" type="button"></button>' );
      $button_edit.on( 'click', onClickEdit );

      $span_edit    = $( '<span class="glyphicon glyphicon-edit"></span>' );

      $span_edit.appendTo( $button_edit );
      $button_edit.appendTo( $td_edit );

      $td_remove        = $( '<td class="removebutton"></td>' );

      $button_remove = $( '<button data-id="' + event_item._id + '" id="event-remove" type="button"></button>' );
      $button_remove.on( 'click', onClickDestroy );

      $span_remove  = $( '<span class="glyphicon glyphicon-remove"></span>' );

      $span_remove.appendTo( $button_remove );
      $button_remove.appendTo( $td_remove );

      $td_name.appendTo( $tr );
      $td_startDate.appendTo( $tr );
      $td_location.appendTo( $tr );
      $td_edit.appendTo( $tr );
      $td_remove.appendTo( $tr );

      return $tr;
    };
    //DOMメソッド/makeEventTr/終了
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
        $result_text      : $container.find( '#result-text' ),
        $select_date      : $container.find( '#select-date' ),
        $event_exist      : $container.find( '#event-exist' ),
        $event_table      : $container.find( '#div-event-table' ),
        $event_form       : $container.find( '#div-add-event-form' )
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

    // onClickDate
    onClickDate = function( event ) {
      var event_table,
          date_array;

      if ( jqueryMap.$col_sm_8 ) {
        jqueryMap.$col_sm_8.remove();
      }
      //jqueryMap.$row
      jqueryMap.$row.append( configMap.event_form_html );

      setJqueryMap();

      date_array = event.currentTarget.getAttribute( 'data-date').split('-');

      jqueryMap.$select_date.html( date_array[0] + '年' + date_array[1] + '月' + date_array[2] + '日' );

      event_table = makeEventTable( event.currentTarget.getAttribute( 'data-date' ) );

      // その日の登録がなければ'予定はありません'を表示する。
      if ( event_table === null ) {
        jqueryMap.$event_exist.text( '予定はありません。' );
      }
      else {
        jqueryMap.$event_table
          .html( event_table );
      }

      // イベントフォームを非表示に
      jqueryMap.$event_form
        .html(
          makeEventForm( event.currentTarget.getAttribute( 'data-date' ) )
        )
        .hide();
      // マイナスボタンを非表示に
      $('.glyphicon-minus')
        .hide();

      $('.glyphicon-plus').on('click', function() {
        jqueryMap.$event_form.show();
        $('.glyphicon-plus')
          .hide();
        $('.glyphicon-minus')
          .show();
      });

      $('.glyphicon-minus').on('click', function() {
        jqueryMap.$event_form.hide();
        $('.glyphicon-minus')
          .hide();
        $('.glyphicon-plus')
          .show();
      });

    };
    // onClickAddEvent
    // eventのupdateの処理も行う
    onClickAddEvent = function( event ) {
      var event_map = {},
          startDate,
          endDate;

      event.preventDefault();

      stateMap.person = nb.model.person.read();

      // startTimeの設定
      if ( ! $('#startTime').val() ) {
        startDate = $('#startDate').val();
      }
      else {
        startDate = $('#startDate').val() + 'T' + $('#startTime').val();
      }
      // endTimeの設定
      if ( $('#endDate').val() ) {
        if ( $('#endTime').val() ) {
          endDate = $('#endDate').val() + 'T' + $('#endTime').val();
        }
        else {
          endDate = $('#endDate').val();
        }
      }
      else {
        endDate = '';
      }

      event_map = {
        _id       : event.currentTarget.getAttribute( 'data-id' ),
        person_id : stateMap.person._id,
        name      : $('#name').val(),
        startDate : startDate,
        endDate   : endDate,
        location  : $('#location').val()
      };

      // イベントの登録
      nb.model.event.create( event_map );

      $('#div-add-event-form').find(':text').val('');

      return false;
    };

    // event-create-completeイベントが発生したときの処理
    // event.type : 'event-create-complete'が返る
    onEventcreate = function ( event, result_map ) {
      var event_table,
          startDate = result_map.startDate.split( 'T' )[ 0 ];

      // カレンダーに追加する。
      $('.calendar-body [data-date=' + startDate + '] ul')
        .append( '<li data-id="' + result_map._id + '">' + result_map.name + '</li>' ); 

      // イベントリストに追加する。
      event_table = makeEventTable( startDate );

      if ( jqueryMap.$col_sm_8.find( '#event-table' ).length === 0 ) {
        $( '#event-exist' ).empty();
        jqueryMap.$col_sm_8.find( '#div-event-table' )
          .append( event_table );
      }
      else {
        jqueryMap.$col_sm_8.find( '#event-table' )
          .replaceWith( event_table );
      }
    };

    // event-create-completeイベントが発生したときの処理
    // event.type : 'eventupdate'が返る
    onEventupdate = function ( event, result_map ) {
      var $tr;

      // カレンダーのnameを書き換える
      $('.calendar-body [data-id="' + result_map._id + '"]')
        .replaceWith( '<li data-id="' + result_map._id + '">' + result_map.name + '</li>' ); 

      // カレンダーテーブルを書き換える
      $tr = makeEventTr( result_map );
      // event tableを変更する。
      $( '#event-table [data-id="' + result_map._id + '"]' )
        .replaceWith( $tr );

      //  フォームからidを削除する。
      $( '#addEventForm' )
        .removeAttr('data-id');

      // ボタンの名称を元に戻す。
      $( '#addEventButton' ).text( '追加' );
    };

    // eventlist-read-completeイベントが発生したときの処理
    // event.type : 'eventlist-read-complete'が返る
    //
    onEventlistupdate = function ( event, result_map ) {
      var id,
          startDate;

      for ( id in result_map ) {
        if ( result_map.hasOwnProperty( id ) ) {
          startDate = result_map[ id ].startDate.split('T')[ 0 ];

          $('.calendar-body [data-date=' + startDate + '] ul')
            .append( '<li data-id="' + result_map[ id ]._id + '">' + result_map[ id ].name + '</li>' ); 
        }
      }
    };

    // サーバから削除の結果が送信された後
    onEventDelete = function ( event, result_map ) {
      // カレンダーから<li></lib>が削除される。
      $('.calendar-body [data-id="' + result_map._id + '"]')
        .remove();

      // event tableから削除する。
      $('#event-table [data-id="' + result_map._id + '"]')
        .remove();

      if ( $('#event-tbody tr').length === 1 ) {
        $('#event-table').remove();
      }
    };

    onClickEdit = function ( event ) {
      var event_list;

      event_list = nb.model.event.read( { _id: event.currentTarget.getAttribute( 'data-id') } );

      // イベントフォームを表示する。
      jqueryMap.$event_form.show();
      $('.glyphicon-plus')
        .hide();
      $('.glyphicon-minus')
        .show();

      $( '#addEventForm input#name' )
        .val( event_list[0].name );
      $( '#addEventForm input#startDate' )
        .val( event_list[0].startDate.split( 'T' )[ 0 ] );
      $( '#addEventForm input#startTime' )
        .val( event_list[0].startDate.split( 'T' )[ 1 ] );

      // 終了日があればその値を使い、なければ開始日を使う
      if ( event_list[ 0 ].endDate ) {
        $( '#addEventForm input#endDate' )
          .val( event_list[0].endDate.split( 'T' )[ 0 ] );
        $( '#addEventForm input#endTime' )
          .val( event_list[0].endDate.split( 'T' )[ 1 ] );
      }
      else {
        $( '#addEventForm input#endDate' )
          .val( event_list[0].startDate.split( 'T' )[ 0 ] );
        $( '#addEventForm input#endTime' )
          .val( event_list[0].startDate.split( 'T' )[ 1 ] );
      }

      $( '#addEventForm input#location' )
        .val( event_list[0].location );

      $( '#addEventForm' )
        .attr('data-id', event_list[0]._id );

      // ボタンの名称を変更する。
      $( '#addEventButton' ).text( '変更' );
    };

    // 削除ボタンをクリックしたとき
    onClickDestroy = function ( event ) {
      var event_map,
          event_id = event.currentTarget.getAttribute( 'data-id' );

      event_map = nb.model.event.read( { _id: event_id } );

      nb.model.event.destroy( event_map );
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
          currentMonth  = currentDate.format( 'MM' ),
          $config_menu;

      stateMap.container = $container;

      if ($container.find('.container-fluid').length === 0) {
        $config_menu = $('<div id="configuration" />');
        $config_menu.append( configMap.menu_html );
        
        $container
          .append( $('<div class="container-fluid"><div id="row" class="row"></div></div>') )
          .append( $config_menu );

        setJqueryMap();

        setCalendar( currentYear, currentMonth );

        $('.current-date')
          .append( currentDate.format( 'YYYY年MM月DD日dddd' ) );

        $.gevent.subscribe( $container, 'eventcreate', onEventcreate );
        $.gevent.subscribe( $container, 'eventupdate', onEventupdate );
        $.gevent.subscribe( $container, 'eventdelete', onEventDelete );
        $.gevent.subscribe( $container, 'eventlistupdate', onEventlistupdate );
        $.gevent.subscribe( $container, 'localBusiness:viewComplete', onLocalBusinessViewComplete );
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
