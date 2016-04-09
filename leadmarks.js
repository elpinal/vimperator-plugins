(function() {
  var leadmarks = storage.newMap("leadmarks", {
    store: true,
    privateData: true
  });
  var links = [];
  links = [];
  //view links list and open link
  commands.addUserCommand(['leadmarks'], ' leadmarks ', function(args) {
    if (args != "") {
      var a;
      var b;
      var y;
      let arg = args.literalArg;
      let num = arg.match(/^\d+/);
      if (num == null) {
        liberator.echoerr("Error!:should be number");
        return;
      }
      y = links.length;
      for (a = 0; a < y; a++) {
        if (links[a][0].indexOf(num + ":") != -1) {
          b = a;
        }
      }
      if (b == null) {
        liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
        return;
      }
      open(links[b][1], liberator.NEW_TAB);
    } else {
      liberator.echoerr("Error!:not set");
    }
  }, {
    completer: list,
    argCount: "?",
    bang: true,
    count: true,
    literal: 0
  }
  );
  // add link of current tab
  commands.addUserCommand(['addleadmark'], ' addleadmark ', function() {
    add(buffer.URL, buffer.title);
    if (!bookmarks.add(false, buffer.title, buffer.URL, null, [], "", false)) {
      liberator.echoerr("Could not add bookmark: " + buffer.title)
    }
  }
  );
  // delete link
  commands.addUserCommand(['delleadmark'], ' delleadmark ', function(args) {
    if (args != "") {
      var a;
      var b;
      var y;
      let arg = args.literalArg;
      let num = arg.match(/^\d+/);
      if (num == null) {
        liberator.echoerr("Error!:should number");
        return;
      }
      y = links.length;
      for (a = 0; a < y; a++) {
        if (links[a][0].indexOf(num + ":") != -1) {
          b = a;
        }
      }
      if (b == null) {
        liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
        return;
      }
      del(links[b][1]);
    } else {
      liberator.echoerr("Error!:not set");
    }
  }, {
    completer: list,
    argCount: "?",
    bang: true,
    count: true,
    literal: 0
  }
  );

  function formatWithZero(num, n) {
    var ret = String(num);
    while (ret.length < n) {
      ret = "0" + ret;
    }
    return (ret);
  }

  function add(url, name) {
    leadmarks.set(url, name);
    liberator.echomsg("Added Lead Mark '" + name + "': " + url);
  }
  function del(url) {
    leadmarks.remove(url);
    liberator.echomsg("Deleted Lead Mark : " + url);
  }
  function open(url, where) {
    if (url) {
      liberator.open(url, where);
    } else {
      liberator.echoerr("Error!:not set");
    }
  }
  function list(context) {
    var filter;
    filter = context.filter.toLowerCase();
    filter = filter.split(" ");
    context.title = ["Lead Mark", "URL"];
    let i = 1;
    links = [];
    for (let [url, ] in leadmarks) {
      i++ ;
    }
    for (let [url, ] in leadmarks) {
      i = i - 1;
      let title = formatWithZero(i, 3) + ':' + leadmarks.get(url);
      if (filter.length < 2) {
        if ((title.toLowerCase().indexOf(filter[0]) != -1) || (url.toLowerCase().indexOf(filter[0]) != -1)) {
          links.push([title, url]);
        }
      } else {
        var kh = "match"
        for (kk = 0; kk < filter.length; kk++) {
          if ((title.toLowerCase().indexOf(filter[kk]) == -1) && (url.toLowerCase().indexOf(filter[kk]) == -1)) {
            var kh = "notmatch";
          }
        }
        if (kh != "notmatch") {
          links.push([title, url]);
        }
      }
    }
    return [0, links];
  }
})();
