/*
 * nb.paint.js
 * お絵かき機能
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

nb.paint = (function() {

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      canvas_html   : String()
          + '<span>ペンの色を選択します : </span>'
          + '<select name="colorpicker-glyphicons">'
            + '<option value="#7bd148">Green</option>'
            + '<option value="#5484ed">Bold blue</option>'
            + '<option value="#a4bdfc">Blue</option>'
            + '<option value="#46d6db">Turquoise</option>'
            + '<option value="#7ae7bf">Light green</option>'
            + '<option value="#51b749">Bold green</option>'
            + '<option value="#fbd75b">Yellow</option>'
            + '<option value="#ffb878">Orange</option>'
            + '<option value="#ff887c">Red</option>'
            + '<option value="#dc2127">Bold red</option>'
            + '<option value="#dbadff">Purple</option>'
            + '<option value="#e1e1e1">Gray</option>'
          + '</select>'
          + '<br/>'
          + '<canvas id="canvas_area" width="500" height="400">'
          + '</canvas>',
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
    canvas,
    context,
    oldX                = 0,
    oldY                = 0,
    pen_color           = "#7bd148",
    bold_line           = 3,
    onDragstart,
    onDragmove,
    rect;
    //        + '<option value="#7bd148">Green</option>'
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
    // マウスをクリックしたときの処理
    onDragstart = function( e ) {
      rect = e.target.getBoundingClientRect();
      
      oldX = e.px_start_x - rect.left;
      oldY = e.px_start_y - rect.top;
    };

    // マウスが動いているときの処理
    onDragmove = function( e ) {
      var px = e.px_current_x - rect.left,
          py = e.px_current_y - rect.top;

      context.strokeStyle = pen_color;
      context.lineWidth   = bold_line;
      context.beginPath();
      context.moveTo( oldX, oldY );
      context.lineTo( px, py );
      context.closePath();
      context.stroke();
      oldX = px;
      oldY = py;
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
    // 線の太さをセット
    function lineSwitch( key ) {
      bold_line = key.value;
    }

    // キャンバスに描いた線画を消去
    function canvasClear() {
      if ( confirm( 'キャンバスに描いたデータを"クリア"しますか？' ) ) {
        context.clearRect( 0, 0, canvas.width, canvas.height );
      }
    }

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

      jqueryMap.$container.html( configMap.canvas_html );

      $('select[name="colorpicker-glyphicons"]').simplecolorpicker({
        theme   : 'glyphicons'
      }).on('change', function() {
        pen_color = $('select[name="colorpicker-glyphicons"]').val();
      });
      canvas  = document.getElementById( "canvas_area" );
      context = canvas.getContext( "2d" );

      // マウスをクリックしたとき
      $('#canvas_area')
        .bind( "udragstart.udrag", onDragstart );
      // マウスが動いているとき
      $('#canvas_area')
        .bind( "udragmove.udrag", onDragmove );

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
