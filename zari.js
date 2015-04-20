/*
 * @name            zari.js
 * @version         0.1
 */

(function(){
  commands.addUserCommand(
    ['zari'],
    'Search "http://d.hatena.ne.jp/zariganitosh/"',
    function (args) {
      //word = io.system('encode.rb ' + args)
      word = EscapeEUCJP(args.join("+"));
      liberator.open(
        'http://d.hatena.ne.jp/zariganitosh/archive?word=' + word,
        liberator.NEW_TAB);
    }
  );
})(); 
