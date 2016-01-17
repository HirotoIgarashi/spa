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
  'use strict';

  //------ モジュールスコープ変数開始 -----------

  var
    configMap = {
      navbar_html     : String()
            + '<nav class="navbar navbar-default">'
              + '<div class="container-fluid">'
                + '<!-- Brand and toggle get grouped for better mobile display -->'
                + '<div class="navbar-header">'
                  + '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'
                    + '<span class="sr-only">Toggle navigation</span>'
                    + '<span class="icon-bar"></span>'
                    + '<span class="icon-bar"></span>'
                    + '<span class="icon-bar"></span>'
                  + '</button>'
                  + '<a class="navbar-brand" href="/">'
                    + '<img alt="Note" src="/images/note.jpg" height="30px" width="45px">'
                  + '</a>'
                + '</div>'
                + '<!-- Collect the nav links, forms, and other content for toggling -->'
                + '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'
                  + '<ul class="nav navbar-nav navbar-right">'
                    + '<li><button id="startSignup" type="button" class="btn btn-default navbar-btn">'
                      + '<span class="glyphicon glyphicon-plus"></span>アカウントを作成する'
                    + '</button></li>'
                    + '<li><button id="login" type="button" class="btn btn-default navbar-btn">'
                      + '<span class="glyphicon glyphicon-user"></span>ログイン'
                    + '</button></li>'
                  + '</ul>'
                + '</div>'
              + '</div>'
            + '</nav>',
          tabs_html: String()
                + '<ul id="myTabs" class="nav nav-tabs" role="tablist">'
                  + '<li role="presentation" class="active">'
                    + '<a href="#home" id="home-tab" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">Notebookとは</a>'
                  + '</li>'
                  + '<li role="presentation" class="">'
                    + '<a href="#profile" id="profile-tab" role="tab" data-toggle="tab" aria-controls="profile" aria-expanded="false">マシン構成について</a>'
                + '</li>'
                + '</ul>'
                + '<div id="myTabContent" class="tab-content">'
                  + '<div role="tabpanel" class="tab-pane fade active in" id="home" aria-labelledby="home-tab">'
                    + '<div class="container">'
                    + '<h2 class="section-title"><strong>Notebookのサービス(予定)</strong></h2>'
                      + '<div class="row">'
                        + '<div class="col-md-4">'
                          + '<div class="service">'
                          + '<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>'
                          + '<h3><strong>カレンダー</strong></h3>'
                          + '</div>'
                        + '</div>'
                        + '<div class="col-md-4">'
                          + '<div class="service">'
                          + '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>'
                          + '<h3><strong>リスト</strong></h3>'
                          + '</div>'
                        + '</div>'
                        + '<div class="col-md-4">'
                          + '<div class="service">'
                          + '<span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>'
                          + '<h3><strong>タスク</strong></h3>'
                          + '</div>'
                        + '</div>'
                      + '</div>'
                    + '</div>'
                  + '</div>'
                  + '<div role="tabpanel" class="tab-pane fade" id="profile" aria-labelledby="profile-tab">'
                    + '<div class="panel panel-default">'
                    + '<!-- Default panel contents -->'
                    + '<div class="panel-heading">ソフトウェア</div>'
                    + '<div class="panel-body">'
                      + 'Notebookで使用しているライブラリなど'
                    + '</div>'
                    + '<!-- List group -->'
                    + '<ul class="list-group">'
                      + '<li class="list-group-item">Node.js : サーバサイドで使用しています。</li>'
                      + '<li class="list-group-item">MongoDB : これもサーバサイドで使用しています。</li>'
                      + '<li class="list-group-item">Let&#039;s Encrypt : サーバの証明書として利用しています。</li>'
                      + '<li class="list-group-item">javascript : ブラウザで使用しています。</li>'
                      + '<li class="list-group-item">jQuery : ブラウザで使用しています。</li>'
                      + '<li class="list-group-item">Bootstrap : ブラウザで使用しています。</li>'
                    + '</ul>'
                  + '</div>'
                  + '</div>'
                + '</div>',
          signup_html: String()
              + '<div id="signup">'
                + '<form id="signupForm" class="nb-shell-form">'
                  + '<div>'
                    + '<label for="email">E-mailアドレス:</label>'
                    + '<input name="email" id="email" type="text" class="nb-shell-input" placeholder="Email" autofocus/>'
                  + '</div>'
                  + '<div>'
                    + '<label for="password">パスワード:</label>'
                    + '<input name="password" type="password" id="password" placeholder="Password" class="nb-shell-input" />'
                  + '</div>'
                  + '<div>'
                    + '<label for="passconf">パスワード(確認):</label>'
                    + '<input name="passconf" type="password" id="passconf" placeholder="Password" class="nb-shell-input" />'
                  + '</div>'
                  + '<input id="signupButton" type="submit" value="Signup" class="nb-shell-button" />'
                + '</form>'
              + '</div>',
          login_html: String()
              + '<div>'
                + '<form id="loginForm" class="nb-shell-form">'
                  + '<div>'
                  + '<label for="email">Email address:</label>'
                    + '<input type="email" id="email" placeholder="Email" class="nb-shell-input" />'
                  + '</div>'
                  + '<div class="form-group">'
                  + '<label for="password">Password:</label>'
                    + '<input type="password" id="password" placeholder="Password" class="nb-shell-input" />'
                  + '</div>'
                  + '<input id="loginButton" type="submit" value="Login" class="nb-shell-input" />'
                  + '<span>'
                  + '</span>'
                + '</form>'
              + '</div>'
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap,
    onClickLogin,
    onClickSignup,
    initModule;

    //------ モジュールスコープ変数終了 -----------

    //------ ユーティリティメソッド開始 -----------

    // emailのvalidate
    function validateEmail( fld ) {
      var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if ( !emailFilter.test(fld.val()) ) {
        return {
          returnCode  : false,
          errorCode   : "正しいE-mailアドレスを入力してください。"
        };
      }
      return {
        returnCode  : true,
        errorCode   : "OK!"
      };
    }

    // パスワードのvalidate
    function validatePassword( fld ) {
      var illegalChars = /[\W_]/; // allow only letters and numbers

      if (fld.val() === "") {
        return {
          returnCode: false,
          errorCode : "パスワードが入力されていません。"
        };
      }

      if ( (fld.val().length < 7) || (fld.val().length > 15) ) {
        return {
          returnCode: false,
          errorCode : "パスワードは7文字以上、15文字以下にしてください。"
        };
      }

      if ( illegalChars.test(fld.val()) ) {
        return {
          returnCode: false,
          errorCode : "パスワードに無効な文字が含まれています。"
        };
      }

      if ( (fld.val().search(/[a-zA-Z]+/) === -1) || (fld.val().search(/[0-9]+/) === -1) ) {
        return {
          returnCode  : false,
          errorCode   : "パスワードには少なくとも1つの数字が含まれている必要があります。"
        };
      } 

      return {
        returnCode  : true,
        errorCode   : "OK!"
      };
    }
    // compare Password
    function comparePassword( password, passconf ) {

      if ( password.attr('class') === 'nb-shell-input nb-shell-error' ) {
        return {
          returnCode: false,
          errorCode: 'パスワードが正しくありません。'
        };
      }

      if ( passconf.val().length === 0 ) {
        return {
          returnCode: false,
          errorCode: 'パスワードを入力してください。'
        };
      }

      if ( password.val() !== passconf.val() ) {
        return {
          returnCode: false,
          errorCode: '同じパスワードを入力したください。'
        };
      }
      return {
        returnCode: true,
        errorCode: 'OK!'
      };
    }

    // 入力内容が不正なInput Field
    function invalidInput( fld, errorCode ) {
      fld
        .removeClass('nb-shell-valid')
        .addClass('nb-shell-error')
        .after('<span>' + errorCode + '</span>');
    }

    // 入力内容が正しいInput Field
    function comfirmedInput( fld, errorCode ) {
      fld
        .removeClass('nb-shell-error')
        .addClass('nb-shell-valid')
        .after('<span>' + errorCode + '</span>');
    }

    // email, password, passconfのclassにnb-shell-validが入っているか
    function checkRegistForm( email, password, passconf ) {
      if (
        email.hasClass( "nb-shell-valid" ) &&
        password.hasClass( "nb-shell-valid" ) &&
        passconf.hasClass( "nb-shell-valid" )
      ) {
        return true;
      }
      return false;
    }

    //------ ユーティリティメソッド終了 -----------

    //------ DOMメソッド開始 ----------------------
    //DOMメソッド/setJqueryMap/開始

    setJqueryMap = function() {
      var $container = stateMap.$container;

      jqueryMap = {
        $container    : $container,
        $myTabs       : $container.find( '#myTabs' ),
        $myTabContent : $container.find( '#myTabContent' ),
        $startSignup  : $container.find( '#startSignup' ),
        $signupForm   : $container.find( '#signupForm' ),
        $loginForm    : $container.find( '#loginForm' ),
        $login        : $container.find( '#login' )
      };
    };
    //DOMメソッド/setJqueryMap/終了
    //------ DOMメソッド終了 ----------------------

    //------ イベントハンドラ開始 -----------------
    // 例: onClickButton = ...
    onClickSignup = function() {
      var $container  = stateMap.$container;

      setJqueryMap();

      // サインアップフォームを表示する。
      jqueryMap.$myTabs.remove();
      jqueryMap.$myTabContent.remove();
      jqueryMap.$signupForm.remove();
      jqueryMap.$loginForm.remove();
      $container.append( configMap.signup_html);

      // Bind keypress event to textbox
      $('.nb-shell-input').keypress(function(event) {
        var keycode       = event.keyCode || event.which,
            $currentInput = $(this),
            //$inputList    = $('input:enabled');
            $inputList    = $('input');

        if ( keycode === 13 ) {
          //alert("enter key pushed");
          $inputList.each(function( index ) {
            if ( $(this).is($currentInput) ) {
              var targetIndex = (!event.shiftKey) ? (index + 1) : (index - 1);
              $(this).blur();
              $inputList.eq(targetIndex).focus();
              event.preventDefault();
            }
          });
        }
      });

      $('.nb-shell-input').blur(function() {
        var return_object;

        if ( $(this).attr('id') === 'email') {
          return_object = validateEmail($(this));
        }
        else if ( $(this).attr('id') === 'password' ) {
          return_object = validatePassword($(this));
        }
        else if ( $(this).attr('id') === 'passconf' ) {
          return_object = comparePassword( $('#password'), $('#passconf') );
        }

        if ( !return_object.returnCode ) {
          invalidInput( $(this), return_object.errorCode );
        }
        else {
          comfirmedInput( $(this), return_object.errorCode );
        }

        if ( checkRegistForm( $('#email'), $('#password'), $('#passconf') ) ){
          // ポタンを有効にする。
          $('#signupButton')
            .attr("disabled", false)
            .removeClass('disabled');
        }
      });

      $('.nb-shell-input').focus(function() {
        $(this)
          .removeClass('nb-shell-error')
          .next('span')
          .remove();
        // ボタンを無効にする。
        $('#signupButton')
          .attr("disabled", true)
          .addClass('disabled');
      });

      $('#signupForm').submit(function( event ) {
        // Stop form from submitting normally
        event.preventDefault();

        var form_data = {
          email     : $('#email').val(),
          password  : $('#password').val(),
          passconf  : $('#passconf').val()
        };

        $.ajax({
          type        : "POST",
          url         : "user/create",
          data        : JSON.stringify(form_data),
          contentType : "application/json",
          dataType    : "json",
          success     : function( data, dataType ) {
            //alert("Data: " + data + "\nStatus: " + dataType );
            $('#signupButton')
              .after( '<span>  result code: ' + dataType + ': 登録が完了しました。</span>' );
            $('#email')
              .val("")
              .removeClass('nb-shell-valid')
              .next('span')
              .remove();
            $('#password')
              .val("")
              .removeClass('nb-shell-valid')
              .next('span')
              .remove();
            $('#passconf')
              .val("")
              .removeClass('nb-shell-valid')
              .next('span')
              .remove();
          },
          error       : function( data ) {
            $('#email')
              .removeClass('nb-shell-valid')
              .addClass('nb-shell-error')
              .next('span')
              .html( '<span>' + data.responseText + '</span>' );
          }//,
          //complete    : function() {
          //}
        });

      });
      return false;
    };

    onClickLogin = function() {
      var $container = stateMap.$container;
      setJqueryMap();

      jqueryMap.$myTabs.remove();
      jqueryMap.$myTabContent.remove();
      jqueryMap.$signupForm.remove();
      jqueryMap.$loginForm.remove();
      $container.append( configMap.login_html);

      $('#loginForm').submit(function( event ) {
        event.preventDefault();

        var form_data = {
          email     : $('#email').val(),
          password  : $('#password').val()
        };

        $.ajax({
          type        : "POST",
          url         : "user/login",
          data        : JSON.stringify( form_data ),
          contentType : "application/json",
          dataType    : "json",
          success     : function( data ) {
            $('#loginButton')
              .next('span')
              .html( '<span>  result code: ' + data.email + '</span>' );
          },
          error       : function( data ) {
            $('#loginButton')
              .next('span')
              .html( '<span>  result code: ' + data.responseText + '</span>' );
          }
        });
      });

      return false;
    };
    //------ イベントハンドラ終了 -----------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッド/initModule/開始
    initModule = function( $container ) {
      stateMap.$container = $container;

      // 起動時にセッションがあるか確認する。
      $.get( "/user/authentication" )
        .done( function( data ) {
          if ( data.state === "success" ) {
            $container.html( configMap.navbar_html );
            setJqueryMap();
            $('#startSignup')
              .remove();
            $('#login')
              .after('<button id="logout" type="button" class="btn btn-default navbar-btn">ログアウト</button>');
            $('#login')
              .remove();
          }
          else {
            $container.html( configMap.navbar_html );
            $container.append( configMap.tabs_html);
            setJqueryMap();

            // クリックハンドラをバインドする
            jqueryMap.$startSignup
              .click( onClickSignup );
            jqueryMap.$login
              .click( onClickLogin );
          }
        })
        .fail( function( data ) {
            $container.html( configMap.navbar_html );
            $container.append( configMap.tabs_html);
        });
      // $container.html( configMap.navbar_html );
      // $container.append( configMap.tabs_html);

    };
    //パブリックメソッド/initModule/終了

    //パブリックメソッドを返す
    return {
      initModule    : initModule
    };
    //------ パブリックメソッド終了 ---------------
}());
