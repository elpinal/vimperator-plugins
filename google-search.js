/*
 * @name    google-search.js
 * @author  lukana
 * @version 0.1.0
 */

liberator.plugins.exGoogleSearch = {};
var google = liberator.plugins.exGoogleSearch;

var googleURL = 'https://www.google.co.jp/#q=';

google.open = function (words, minor, options) {
	let _modes = {
		"o": liberator.CURRENT_TAB,
		"t": liberator.NEW_TAB,
		"b": liberator.NEW_BACKGROUND_TAB,
		"w": liberator.NEW_WINDOW
	};

	let [lang, time] = ["", ""];

	if (options) {
		if (options.lang)
			lang = "&lr=lang_" + options.lang;
		if (options.time)
			time = "&tbs=qdr:" + options.time;
	}

	liberator.open(googleURL + words + lang + time, _modes[minor]);
};

google.lang = function (lang) {
	let title = buffer.title;
	let word  = encodeURIComponent(title.replace(/ - Google 検索$/, "")).replace("%20", "+", "g");
	let url   = buffer.URL;
	/*
	   let page = "";
	   if ( /&start=\d{1,3}/.test(url) )
	   page = url.match(/&start=\d{1,3}/);
	 */
	let lr = lang != "" ? lang : "ja";

	if ((time = url.match(/qdr:([ymwdhns]\d*)/))){
		google.open(word, "o", {"lang": lr, "time": time[1]});
	} else {
		google.open(word, "o", {"lang": lr});
	}
};

google.time = function (count, past) {
	let url   = buffer.URL;
	let title = buffer.title;
	let word  = encodeURIComponent(title.replace(/ - Google 検索$/, "")).replace("%20", "+", "g");

	if (count < 1)
		count = "";
	if (!past)
		past = "y";

	if (/lang_ja/.test(url)) {
		google.open(word, "o", {"lang": "ja", "time": past + count});
	} else {
		google.open(word, "o", {"time": past + count});
	}
};

(function () {
	commands.addUserCommand(['googlelang'], 'Search with specified language in Google',
				function (args) { google.lang(args); });

	commands.addUserCommand(['googletime'], 'Set time range in Google',
				function (args) { google.time(args.count, args.literalArg); },
				{ argCount: "?", count: true, literal: 0 });

	mappings.add([modes.NORMAL], ["@y"],
		     "Set time range in Google",
		     function (count) { google.time(count); },
		     { count: true });
})();
