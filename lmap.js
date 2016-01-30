(function() {
        function map(args, modes, noremap) {
                let urls = args['-urls'];

                if (!args.length) {
                        mappings.list(modes, null, urls && RegExp(urls));
                        return;
                }

                let [lhs, rhs] = args;

                if (!rhs) // list the mapping
                        mappings.list(modes, mappings._expandLeader(lhs), urls && RegExp(urls));
                else {
                        // this matches Vim's behaviour
                        if (/^<Nop>$/i.test(rhs))
                                noremap = true;

                        mappings.addUserMap(modes, [lhs],
                                            "User defined mapping",
                                            function (count) { events.feedkeys((count || "") + this.rhs, this.noremap, this.silent); },
                                            {
                                                    count: true,
                                                    rhs: events.canonicalKeys(mappings._expandLeader(rhs)),
                                                    noremap: !!noremap,
                                                    silent: "<silent>" in args,
                                                    matchingUrls: urls
                                            });
                }
        }

        let m = [modes.INSERT, modes.COMMAND_LINE, modes.SEARCH_FORWARD, modes.SEARCH_BACKWARD];

        // :map, :noremap => NORMAL + VISUAL modes
        function isMultiMode(map, cmd) {
                return map.modes.indexOf(modules.modes.NORMAL) >= 0
                        && map.modes.indexOf(modules.modes.VISUAL) >= 0
                        && /^[nv](nore)?map$/.test(cmd);
        }

        function regexpValidator(expr) {
                try {
                        RegExp(expr);
                        return true;
                }
                catch (e) {}
                return false;
        }

        function urlsCompleter (modes, current) {
                return function () {
                        let completions = util.Array.uniq([
                                                          m.matchingUrls.source
                                                          for (m in mappings.getUserIterator(modes))
                                                          if (m.matchingUrls)
                        ]).map(function (re) [re, re]);
                        if (current) {
                                if (buffer.URL)
                                        completions.unshift([util.escapeRegex(buffer.URL), "Current buffer URL"]);
                                if (content.document && content.document.domain)
                                        completions.unshift([util.escapeRegex(content.document.domain), "Current buffer domain"]);
                        }
                        return completions;
                };
        }

        const opts = {
                completer: function (context, args) completion.userMapping(context, args, m),
                options: [
                        [["<silent>", "<Silent>"],  commands.OPTION_NOARG],
                        [["-urls", "-u"],  commands.OPTION_STRING, regexpValidator, urlsCompleter(m, true)],
                ],
                literal: 1,
                serial: function () {
                        function options (map) {
                                let opts = {};
                                if (map.silent)
                                        opts["<silent>"] = null;
                                if (map.matchingUrls)
                                        opts["-urls"] = map.matchingUrls.source;
                                return opts;
                        }

                        let noremap = this.name.indexOf("noremap") > -1;
                        return [
                        {
                                command: this.name,
                                options: options(map),
                                arguments: [map.names[0]],
                                literalArg: map.rhs
                        }
                        for (map in mappings._mappingsIterator(m, mappings._user))
                                if (map.rhs && map.noremap == noremap && !isMultiMode(map, this.name))
                        ];
                }
        };

        commands.addUserCommand(["lnoremap"],
                                "Map a key sequence without remapping keys in lang-arg mode",
                                function (args) { map(args, m, true); },
                                opts);
})();

