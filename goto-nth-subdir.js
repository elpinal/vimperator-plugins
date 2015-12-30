/*
 * @name goto-nth-subdir.js
 * @description	"Go to the root/[n-depth-subdir] of the website"
 * @author lukana
 * @version 0.0.1
 *
 * LICENSE
 *   Public Domain http://creativecommons.org/licenses/publicdomain/
 *
 * USAGE
 *   :goto <count>
 *
 *   <count><
 * 
 */

liberator.plugins.exGoToNthSubdir = (function(){
  commands.addUserCommand(['goto'], 'Go to nth subdir',
      function (args) {
        let n = 1;
        if (args > 1) {
          n = count;
        }
        liberator.plugins.exGoToNthSubdir.goto(n);
      });

  mappings.add([modes.NORMAL], ["<"],
      "Go to nth subdir",
      function (count) { liberator.plugins.exGoToNthSubdir.goto(Math.max(count, 1)); },
      { count: true });

  return {
    goto: function goto(count)
    {
        let uri = content.document.location;
        let subdir = uri.pathname.split("/").slice(1, count).join("/");
        liberator.assert(!/(about|mailto):/.test(uri.protocol)); // exclude these special protocols for now
        liberator.open(uri.protocol + "//" + (uri.host || "") + "/" + subdir);
    }
  };
})();
