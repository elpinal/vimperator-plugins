/* 
 * @name            backtoclose.js
 * @author          lukana
 * @version         0.1.0
 */

liberator.plugins.exBacktoclose = (function () {
	commands.addUserCommand(['backtoclose'], 'Back to close',
				function (args) {
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
					literal: 0,
					completer: function completer(context) {
						let sh = history.session;

						context.anchored = false;
						context.compare = CompletionContext.Sort.unsorted;
						context.filters = [CompletionContext.Filter.textDescription];
						context.completions = sh.slice(0, sh.index).reverse();
						context.keys = { text: function (item) (sh.index - item.index) + ": " + item.URI.spec, description: "title", icon: "icon" };
					}
				});

	mappings.add([modes.NORMAL], ["<C-q>", "<BS>"],
		     "Back to close",
		     function (count) { liberator.plugins.exBacktoclose.backtoclose(Math.max(count, 1)); },
		     { count: true });

	return {
		backtoclose: function backtoclose(count)
		{
			let sh = window.getWebNavigation().sessionHistory;

			if (sh && sh.index > (count - 1)) {
				window.getWebNavigation().gotoIndex(sh.index - count);
			} else {
				tabs.remove(tabs.getTab(), 1, 0, 0);
			}
		}
	};
})();
