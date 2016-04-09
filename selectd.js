(function() {
  commands.addUserCommand(['selectd', 'sd'], 'Close selected tabs', function(args) {
    if (args != "") {
      let vTabs = config.tabbrowser.visibleTabs;
      let arrayList = exnum(args);
      let filteredList = arrayList.filter(e => (0 < e && e <= vTabs.length));
      let sortedList = filteredList.sort((a, b) => a < b);

      sortedList.forEach(e => config.tabbrowser.removeTab(vTabs[e - 1]));
      liberator.echomsg("Closed Tab " + indexize(sortedList.reverse()).join(', '));
    } else {
      config.tabbrowser.removeTab(gBrowser.mCurrentTab);
      liberator.echomsg("Closed Current Tab");
    }
  }, {
    argCount: "*",
    completer: function(context) {
      completion.buffer(context)
    },
    literal: false
  });

  function exnum(numbers) {
    let set = new Set();
    for (let n of numbers) {
      if (typeof (n) != 'number') {
        let matches = n.match(/(\d+)-(\d+)/);
        if (matches) {
          let start = Math.min(matches[1], matches[2]);
          let end = Math.max(matches[1], matches[2]);
          let i = start;
          while (i <= end) {
            set.add(i++);
          }
          continue;
        }
        n = parseInt(n);
      }
      set.add(n);
    }
    return [...set];
  }

  function indexize(ar) {
    let out = new Array();
    for (let i = 0; i < ar.length; i++) {
      var a = i + 1;
      var current = ar[i];
      var concat = false;
      while (parseInt(ar[a++]) == (current + 1)) {
        current = ar[a - 1];
        concat = true;
      }
      if (concat) {
        //if ( parseInt( ar[i] ) + 1 == current ) {
        //	out.push( ar[i] );
        //	out.push( ar[i + 1] );
        //} else {
        out.push(ar[i] + "-" + current);
      //}
      } else {
        out.push(ar[i]);
      }
      i = a - 2;
    }
    return out;
  }
})();
