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
                + '<a class="navbar-brand" href="#">'
                  + '<img alt="Note" src="/images/note.jpg" height="30px" width="45px">'
                + '</a>'
              + '</div>'
              + '<!-- Collect the nav links, forms, and other content for toggling -->'
              + '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'
                + '<ul class="nav navbar-nav">'
                  + '<li class="dropdown">'
                    + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>'
                    + '<ul class="dropdown-menu">'
                      + '<li><a href="#">Action</a></li>'
                      + '<li><a href="#">Another action</a></li>'
                      + '<li><a href="#">Something else here</a></li>'
                      + '<li role="separator" class="divider"></li>'
                      + '<li><a href="#">Separated link</a></li>'
                      + '<li role="separator" class="divider"></li>'
                      + '<li><a href="#">One more separated link</a></li>'
                    + '</ul>'
                  + '</li>'
                + '</ul>'
                + '<form class="navbar-form navbar-left" role="search">'
                  + '<div class="form-group">'
                    + '<input type="text" class="form-control" placeholder="Search">'
                  + '</div>'
                  + '<button type="submit" class="btn btn-default">Submit</button>'
                + '</form>'
                + '<ul class="nav navbar-nav navbar-right">'
                  + '<li><button id="startSignup" type="button" class="btn btn-default navbar-btn">'
                    + '<span class="glyphicon glyphicon-plus"></span>アカウントを作成する'
                  + '</button></li>'
                  + '<li><button id="login" type="button" class="btn btn-default navbar-btn">'
                    + '<span class="glyphicon glyphicon-user"></span>ログイン'
                  + '</button></li>'
                  + '<li class="dropdown">'
                    + '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>'
                    + '<ul class="dropdown-menu">'
                      + '<li><a href="#">Action</a></li>'
                      + '<li><a href="#">Another action</a></li>'
                      + '<li><a href="#">Something else here</a></li>'
                      + '<li role="separator" class="divider"></li>'
                      + '<li><a href="#">Separated link</a></li>'
                    + '</ul>'
                  + '</li>'
                + '</ul>'
              + '</div>'
            + '</div>'
          + '</nav>',
          tabs_html: String()
                      + '<ul id="myTabs" class="nav nav-tabs" role="tablist">'
                        + '<li role="presentation" class="active">'
                          + '<a href="#home" id="home-tab" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">Home</a>'
                        + '</li>'
                        + '<li role="presentation" class="">'
                          + '<a href="#profile" id="profile-tab" role="tab" data-toggle="tab" aria-controls="profile" aria-expanded="false">Profile</a>'
                        + '</li>'
                        + '<li role="presentation" class="dropdown">'
                          + '<a href="#" id="myTabDrop1" class="dropdown-taggle" data-toggle="dropdown" aria-controls="myTabDrop1-contents" aria-expanded="false">Dropdown<span class="caret"></span></a>'
                            + '<ul class="dropdown-menu" aria-labelledby="myTabDrop1" id="myTabDrop1-contents">'
                              + '<li class=""><a href="#dropdown1" role="tab" id="dropdown1-tab" data-toggle="tab" aria-controls="dropdown1" aria-expanded="false">Dropdown1</a></li>'
                              + '<li><a href="#dropdown2" role="tab" id="dropdown2-tab" data-toggle="tab" aria-controls="dropdown2" aria-expanded="false">Dropdown2</a></li>'
                            + '</ul>'
                        + '</li>'
                      + '</ul>'
                      + '<div id="myTabContent" class="tab-content">'
                        + '<div role="tabpanel" class="tab-pane fade active in" id="home" aria-labelledby="home-tab">'
                          + 'Raw denim you probably haven’t heard of them jean shorts Austin. Nesciunt tofu'
                            + 'stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg'
                            + 'carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth.'
                            + 'Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat'
                            + 'salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher'
                            + 'voluptate nisi qui.'
                        + '</div>'
                        + '<div role="tabpanel" class="tab-pane fade" id="profile" aria-labelledby="profile-tab">'
                          + 'Food truck fixie locavore, accusamus mcsweeney’s marfa nulla single-origin coffee squid'
                            + '. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson'
                            + 'artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress,'
                            + 'commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo'
                            + 'nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica'
                            + 'VHS salvia yr, vero magna velit sapiente labore stumptown.'
                        + '</div>'
                        + '<div role="tabpanel" class="tab-pane fade" id="dropdown1" aria-labelledby="dropdown1-tab">'
                          + 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney’s'
                            + 'organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify'
                            + 'pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy'
                            + 'hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred'
                            + 'pitchfork. Williamsburg banh mi whatever gluten-free, carles pitchfork biodiesel'
                            + 'fixie etsy retro mlkshk vice blog. Scenester cred you probably haven’t heard of them'
                            + ', vinyl craft beer blog stumptown. Pitchfork sustainable tofu synth chambray yr.'
                        + '</div>'
                        + '<div role="tabpanel" class="tab-pane fade" id="dropdown2" aria-labelledby="dropdown2-tab">'
                        + 'Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they'
                          + 'sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny'
                          + 'pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin.'
                          + 'Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS'
                          + 'viral locavore cosby sweater. Lomo wolf viral, mustache readymade thundercats'
                          + 'keffiyeh craft beer marfa ethical. Wolf salvia freegan, sartorial keffiyeh echo park'
                          + 'vegan.'
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
                  + '<input type="submit" value="Login" class="nb-shell-input" />'
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
          errorCode: 'パスワードを入力したください。'
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
          success     : function( data, dataType ) {
            //alert("Data: " + data + "\nStatus: " + dataType );
            $('#signupButton')
              .after( '<span>  Result: ' + dataType + '</span>' );
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
          contentType : "application/json",
          dataType    : "json",
          error       : function() {
            alert("Server Error.");
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

      // Bind keypress event to textbox
      $('.nb-shell-input').keypress(function(event) {
        var keycode = event.keyCode || event.which;
        if ( keycode === 13 ) {
          alert('You pressed a "enter" key in textbox');
        }
        return false;
      });

      $('#loginForm').submit(function( event ) {
        alert( "handler for .submit() called." );
        event.preventDefault();
      });

      return false;
    };
    //------ イベントハンドラ終了 -----------------

    //------ パブリックメソッド開始 ---------------
    //パブリックメソッド/initModule/開始
    initModule = function( $container ) {
      stateMap.$container = $container;
      $container.html( configMap.navbar_html );
      $container.append( configMap.tabs_html);
      setJqueryMap();

      // クリックハンドラをバインドする
      jqueryMap.$startSignup
        .click( onClickSignup );
      jqueryMap.$login
        .click( onClickLogin );
    };
    //パブリックメソッド/initModule/終了

    //パブリックメソッドを返す
    return {
      initModule    : initModule
    };
    //------ パブリックメソッド終了 ---------------
}());
