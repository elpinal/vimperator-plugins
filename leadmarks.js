(function() {
  var leadmarks = storage.newMap("leadmarks", {
    store: true,
    privateData: true
  });
  var links = [];

  //view links list and open link
  commands.addUserCommand(['leadmarks'], ' leadmarks ', function(args) {
    let num = args.literalArg.match(/^\d+/);
    if (num == null) {
      liberator.echoerr("Error!:should be number");
      return;
    }
    for (let i = 0; i < links.length; i++) {
      if (links[i][0].indexOf(num + ":") != -1) {
        open(links[i][1], liberator.NEW_TAB);
        return;
      }
    }
    liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
  }, {
    completer: list,
    argCount: "1",
    bang: true,
    count: true,
    literal: 0
  });

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
    let num = args.literalArg.match(/^\d+/);
    if (num == null) {
      liberator.echoerr("Error!:should be number");
      return;
    }
    for (let i = 0; i < links.length; i++) {
      if (links[i][0].indexOf(num + ":") != -1) {
        del(links[i][1]);
        return;
      }
    }
    liberator.echoerr("Error!:no leadmarks matching string: \"" + args + "\"");
  }, {
    completer: list,
    argCount: "1",
    bang: true,
    count: true,
    literal: 0
  });

  function leftpad(str, len, ch) {
    str = String(str);
    if (!ch && ch !== 0) {
      ch = ' ';
    }
    return String(ch).repeat(len - str.length) + str;
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
    // Initialize
    links = [];
    for (let [url, ] in leadmarks) {
      i++ ;
    }
    for (let [url, ] in leadmarks) {
      i = i - 1;
      let title = leftpad(i, 3, "0") + ':' + leadmarks.get(url);
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
