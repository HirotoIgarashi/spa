/*
 * nb.util_b.js
 * JavaScriptブラウザユーティリティ
*/

/*jslint        browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb, getComputedStyle */

nb.util_b = (function() {
  'use strict';

  //------ モジュールスコープ変数開始 -----------
  var
    configMap = {
      regex_encode_html : /[&"'><]/g,
      regex_encode_noamp  : /["'><]/g,
      html_encode_map  : {
        '&' : '&#38',
        '"' : '&#34',
        "'" : '&#39',
        '>' : '&#62',
        '<' : '&#60'
      }
    },

    decodeHtml,
    encodeHtml;

    configMap.encode_noamp_map = $.extend(
      {}, configMap.html_encode_map
    );
    delete configMap.encode_noamp_map['&'];
    //------ モジュールスコープ変数終了 -----------

    //------ ユーティリティメソッド開始 -----------
    // 例: getTrimmedString

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    // decodeHtml開始
    // HTMLエンティティをブラウザに適した方法でデコードする
    // http://stackoverflow.com/questions/1912501/\
    // unescape-html-entities-in-javascriptを参照
    //
    decodeHtml = function ( str ) {
      return $('<div/>').html( str || '' ).text();
    };

    // decodeHtml終了
    
    // encodeHtml開始
    // これはhtmlエンティティのための単一パスエンコーダであり、
    // 任意の数の文字に対応する
    //
    encodeHtml = function ( input_arg_str, exclude_amp ) {
      var input_str = String( input_arg_str ),
          regex,
          lookpu_map;

      if ( exclude_amp ) {
        lookpu_map  = configMap.encode_noamp_map;
        regex       = configMap.regex_encode_noamp;
      }
      else {
        lookpu_map  = configMap.html_encode_map;
        regex       = configMap.regex_encode_html;
      }
      return input_str.replace(
        regex,
        function ( match, name ) {
          return lookpu_map[ match ] || '';
        }
      );
    };
    // encodeHtml終了
    //------ DOMメソッド終了 ----------------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッドを返す
    return {
      decodeHtml  : decodeHtml,
      encodeHtml  : encodeHtml
    };
    //------ パブリックメソッド終了 ---------------
}());
