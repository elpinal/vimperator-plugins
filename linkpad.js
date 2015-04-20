/*
 * @name            linkpad.js
 * @description     like LinkPad of Netscape.
 * @description-ja  ネットスケープのLinkPadのようなもの。
 * @author          wocota <wocota@gmail.com> --> lukana
 * @version         1.0.0
 *
 * LICENSE
 *   Public Domain http://creativecommons.org/licenses/publicdomain/
 *
 * USAGE
 *   :linkpad [site]
 *     LinkPadに登録されているサイトを表示。選択して新規タブで開く。
 *   :addlinkpad
 *     LinkPadに登録。
 * 
 */

liberator.plugins.exLinkPad = (function(){
  var linkpad = storage.newMap("linkpad", { store: true, privateData: true });
  var links = [];
  links = [];
  //view links list and open link
  commands.addUserCommand(['linkpad'],' linkpad ',
                          function (args){
                            if(args != ""){
                              var a, b, y;
                              let arg = args.literalArg;
                              let num = arg.match(/^\d+/);
                              if(num == null){
                                liberator.echoerr("Error!:should be number");
                                return;
                              }
                              y = links.length;
                              for(a = 0; a < y; a++){
                                if(links[a][0].indexOf(num + ":") != -1)
                                  b = a;
                              }
                              if(b == null){
                                liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
                                return;
                              }
                              liberator.plugins.exLinkPad.open(links[b][1], liberator.NEW_TAB);
                            } else {
                              liberator.echoerr("Error!:not set");
                            }
                          },{
                            completer: function(context) liberator.plugins.exLinkPad.list(context),
                            argCount: "?",
                            bang: true,
                            count: true,
                            literal: 0
                          }
  );
  // add link of current tab
  commands.addUserCommand(['addlinkpad'],' addlinkpad ',
                          function (){
                            liberator.plugins.exLinkPad.add(buffer.URL, buffer.title);
                          }
  );
  // delete link
  commands.addUserCommand(['dellinkpad'],' dellinkpad ',
                          function (args){
                            if(args != ""){
                              var a, b, y;
                              let arg = args.literalArg;
                              let num = arg.match(/^\d+/);
                              if(num == null){
                                liberator.echoerr("Error!:should number");
                                return;
                              }
                              y = links.length;
                              for(a = 0; a < y; a++){
                                if(links[a][0].indexOf(num + ":") != -1)
                                  b = a;
                              }
                              if(b == null){
                                liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
                                return;
                              }
                              liberator.plugins.exLinkPad.del(links[b][1]);
                            } else {
                              liberator.echoerr("Error!:not set");
                            }
                          },{
                            completer: function(context) liberator.plugins.exLinkPad.list(context),
                            argCount: "?",
                            bang: true,
                            count: true,
                            literal: 0
                          }
  );

  return {
    add: function add(url, name)
    {
      linkpad.set(url, name);
      liberator.echomsg("Added Link Pad '" + name + "': " + url);
    },
    del: function del(url)
    {
    	linkpad.remove(url);
    	liberator.echomsg("Deleted Link Pad : " + url);
    },
    open: function open(url, where)
    {
      if (url) {
        liberator.open(url, where);
        linkpad.remove(url);
      } else {
        liberator.echoerr("Error!:not set");
      }
    },
    list: function list(context){
      var filter;
      filter = context.filter.toLowerCase();
      filter = filter.split(" ");
      function ZeroFormat(num, n){
        var ret=""+num;
        while(ret.length < n){
          ret = "0" + ret;
        }
        return (ret);
      }
      context.title = ["Link Pad", "URL"];
      let i = 1;
      links = [];
      for(let [url,] in linkpad){
        i++ ;
      }
      for(let [url,] in linkpad){
        i = i - 1;
        let title = ZeroFormat(i,2) + ':' + linkpad.get(url);
        if(filter.length < 2){
          if((title.toLowerCase().indexOf(filter[0]) != -1) || (url.toLowerCase().indexOf(filter[0]) != -1))
            links.push([title, url]);
        }else{
          var kh = "match"
          for(kk = 0; kk < filter.length; kk++){
            if((title.toLowerCase().indexOf(filter[kk]) == -1) && (url.toLowerCase().indexOf(filter[kk]) == -1))
            var kh = "notmatch";
          }
          if (kh  != "notmatch")
          links.push([title, url]);
        }
      }
      return [0, links];
    }
  };
})();
