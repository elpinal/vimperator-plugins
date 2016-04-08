(function() {
  hints.addMode('h', 'Show value of href',
    (elem, loc) => liberator.echomsg(loc),
    () => '//a');
})();
