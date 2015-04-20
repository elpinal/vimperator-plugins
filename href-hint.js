/*
 * @name     href-hint.js
 * @version  0.1.0
 */

(function() {
	hints.addMode('h', 'Show value of href',
		      (elem, loc) => liberator.echomsg(loc),
		      () => '//a');
})();
