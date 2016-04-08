liberator.plugins.exBacktoclose = (function() {
  commands.addUserCommand(['backtoclose'], 'Back to close', function(args) {
    if (window.getWebNavigation) {
      let a = args.literalArg;
      if (a) {
        //
      } else {
        liberator.plugins.exBacktoclose.backtoclose(Math.max(count, 1));
      }
    }
  },
    {
      argCount: "?",
      count: true,
      literal: 0
    });

  mappings.add([modes.NORMAL], ["<C-q>", "<BS>"],
    "Back to close", function(count) {
      liberator.plugins.exBacktoclose.backtoclose(Math.max(count, 1));
    },
    {
      count: true
    });

  return {
    backtoclose: function backtoclose(count) {
      let sh = window.getWebNavigation().sessionHistory;

      if (sh && sh.index > (count - 1)) {
        window.getWebNavigation().gotoIndex(sh.index - count);
      } else {
        tabs.remove(tabs.getTab(), 1, 0, 0);
      }
    }
  };
})();
