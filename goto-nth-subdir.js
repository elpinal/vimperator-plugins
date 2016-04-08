liberator.plugins.exGoToNthSubdir = (function() {
  commands.addUserCommand(['goto'], 'Go to nth subdir', function(args) {
    let n = 0;
    if (args > 0) {
      n = count;
    }
    liberator.plugins.exGoToNthSubdir.goto(n);
  });

  mappings.add([modes.NORMAL], ["<"],
    "Go to nth subdir", function(count) {
      liberator.plugins.exGoToNthSubdir.goto(Math.max(count, 0));
    },
    {
      count: true
    });

  return {
    goto: function goto(count) {
      let uri = content.document.location;
      let subdir = uri.pathname.split("/").slice(1, count + 1).join("/");
      liberator.assert(!/(about|mailto):/.test(uri.protocol)); // exclude these special protocols for now
      liberator.open(uri.protocol + "//" + (uri.host || "") + "/" + subdir);
    }
  };
})();
