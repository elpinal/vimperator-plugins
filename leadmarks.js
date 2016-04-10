(function() {
  var leadmarks = storage.newMap("leadmarks", {
    store: true,
    privateData: true
  });
  var links = [];

  // View links list and open link.
  commands.addUserCommand(["leadmarks"], "List or open leadmarks", function(args) {
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
  commands.addUserCommand(["addleadmark"], "Add a leadmark", function() {
    add(buffer.URL, buffer.title);
  });

  // Delete link.
  commands.addUserCommand(["delleadmark"], "Delete a leadmark", function(args) {
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
    let filter = context.filter.toLowerCase().split(" ");
    context.title = ["Lead Mark", "URL"];

    // Initialize
    links = [];

    let n = 1;
    for (let [] in leadmarks) {
      n++;
    }

    outer:
    for (let [url, ] in leadmarks) {
      n--;
      let title = leftpad(n, 3, "0") + ':' + leadmarks.get(url);
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
