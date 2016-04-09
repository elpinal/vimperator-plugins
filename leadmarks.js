(function() {
  var leadmarks = storage.newMap("leadmarks", {
    store: true,
    privateData: true
  });
  var links = [];

  // View links list and open link.
  commands.addUserCommand(['leadmarks'], ' leadmarks ', function(args) {
    let num = args.literalArg.match(/^\d+/);
    if (num == null) {
      liberator.echoerr("Start with numbers");
      return;
    }
    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i][0].indexOf(num + ":") != -1) {
        open(links[i][1], liberator.NEW_TAB);
        return;
      }
    }
    liberator.echoerr("No leadmarks matching string: " + args.string);
  }, {
    completer: list,
    argCount: "+",
    literal: false
  });

  // Add link of current tab.
  commands.addUserCommand(['addleadmark'], ' addleadmark ', function() {
    add(buffer.URL, buffer.title);
    if (!bookmarks.add(false, buffer.title, buffer.URL, null, [], "", false)) {
      liberator.echoerr("Could not add bookmark: " + buffer.title)
    }
  });

  // Delete link.
  commands.addUserCommand(['delleadmark'], ' delleadmark ', function(args) {
    let num = args.literalArg.match(/^\d+/);
    if (num == null) {
      liberator.echoerr("Start with numbers");
      return;
    }
    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i][0].indexOf(num + ":") != -1) {
        del(links[i][1]);
        return;
      }
    }
    liberator.echoerr("No leadmarks matching string: " + args.string);
  }, {
    completer: list,
    argCount: "+",
    literal: false
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
    liberator.echomsg("Deleted Lead Mark: " + url);
  }
  function open(url, where) {
    liberator.open(url, where);
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

    outer:
    for (let [url, ] in leadmarks) {
      i = i - 1;
      let title = leftpad(i, 3, "0") + ':' + leadmarks.get(url);
      for (let i = 0; i < filter.length; i++) {
        if ((title.toLowerCase().indexOf(filter[i]) == -1) && (url.toLowerCase().indexOf(filter[i]) == -1)) {
          continue outer;
        }
      }
      links.push([title, url]);
    }
    return [0, links];
  }
})();
