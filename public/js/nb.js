/*
 * nb.js
 * ルート名前空間モジュール
 */
/*jslint          browser : true, continue  : true,
devel   : true, indent  : 2,    maxerr    : 50,
newcap  : true, nomen   : true, plusplus  : true,
regexp  : true, sloppy  : true, vars      : false,
white   : true
*/

/*global $, nb */

var nb = (function() {
  var initModule = function( $container ) {
    nb.model.initModule();
    nb.shell.initModule( $container );
  };

  return { initModule: initModule };
}());
