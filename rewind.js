/*
 * @name            rewind.js
 * @description     like Opera's Rewind, history back per domain
 * @description-ja  OperaのRewindのように、ドメイン毎に戻る
 * @author          lukana
 * @version         0.1.0
 *
 * LICENSE
 *   <TODO>
 *
 * USAGE
 *   :rewind
 *     ドメイン毎に戻る
 */

liberator.plugins.exRewind = (function() {
	commands.addUserCommand(['rewind'], 'Rewind',
				function (args) {
					liberator.plugins.exRewind.rewind(args);
				});

	mappings.add([modes.NORMAL], ["<C-S-q>", "<C-BS>"],
		     "Rewind",
		     function (count) { liberator.plugins.exRewind.rewind(count); },
		     { count: true });

	return {
		rewind: function rewind(count)
		{
			if (!window.getWebNavigation().canGoBack) {
				liberator.echomsg("Removing tab: " + (tabs.index() + 1) + ": " + buffer.title);
				tabs.remove(tabs.getTab(), 1, 0, 0);
				return;
			}
			if (count == "0")
				return;
			if (count == "" || count == null || count == undefined)
				count = 1;
			
			var ses     = history.session;
			var curHost = ses[ses.index].URI.host;
			var n = 0;
			for (var i = ses.index - 1; i >= 0; i--) {
				if (curHost == ses[i].URI.host)
					continue;
				n++;
				if (n == count)
					break;
				curHost = ses[i].URI.host;
			}

			if (n == 0 || n < count) {
				liberator.echomsg("Removing tab: " + (tabs.index() + 1) + ": " + buffer.title);
				tabs.remove(tabs.getTab(), 1, 0, 0);
			} else {
				window.getWebNavigation().gotoIndex(i);
			}
		}
	};
})();
