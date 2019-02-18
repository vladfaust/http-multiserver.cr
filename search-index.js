crystal_doc_search_index_callback({"repository_name":"github.com/vladfaust/http-multiserver.cr","body":"# HTTP::Multiserver\n\n[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)\n[![Build status](https://img.shields.io/travis/vladfaust/http-multiserver.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/http-multiserver.cr)\n[![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg?style=flat-square)](https://vladfaust.com/http-multiserver.cr)\n[![Releases](https://img.shields.io/github/release/vladfaust/http-multiserver.cr.svg?style=flat-square)](https://github.com/vladfaust/http-multiserver.cr/releases)\n[![Awesome](https://github.com/vladfaust/awesome/blob/badge-flat-alternative/media/badge-flat-alternative.svg)](https://github.com/veelenga/awesome-crystal)\n[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)\n[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)\n\nThe requests dispatcher shard for [Crystal](https://crystal-lang.org/).\n\n[![Become a Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)\n\n## About\n\n`HTTP::Multiserver` dispatches a server request to another vanilla `HTTP::Server` depending on its path similar to Ruby's [Rack::URLMap](http://www.rubydoc.info/gems/rack/Rack/URLMap).\n\n## Installation\n\nAdd this to your application's `shard.yml`:\n\n```yaml\ndependencies:\n  http-multiserver:\n    github: vladfaust/http-multiserver.cr\n    version: ~> 0.2.0\n```\n\nThis shard follows [Semantic Versioning 2.0.0](https://semver.org/), so see [releases](https://github.com/vladfaust/http-multiserver.cr/releases) and change the `version` accordingly.\n\n## Usage\n\n### Basic example\n\n```crystal\nrequire \"http-multiserver\"\n\nsimple_server = HTTP::Server.new([HTTP::LogHandler.new]) do |context|\n  context.response.print(\"Hello from Simple Server!\")\nend\n\n# For example purposes\nresque = Resque::Server.new\n\nmultiserver = HTTP::Multiserver.new({\n  \"/resque\" => resque,\n  \"/\"       => simple_server,\n}, [HTTP::ErrorHandler.new(true)]) do |context|\n  # This is an optional custom fallback handler; by default returns \"404 Not Found\"\n  context.response.status_code = 418\n  context.response.print(\"☕ #{context.request.path} not found\")\nend\n\nmultiserver.bind_tcp(5000)\nmultiserver.listen\n```\n\n`HTTP::Multiserver` extends from a regular `HTTP::Server`, so it *CAN* have its own handlers. Same for underlying servers, they obviously *CAN* have their own handlers too.\n\n### Mapping\n\nMapping relies on either `String` or `Regex` keys; when using `String` as a key, a slash is automatically appended to it.\n\nAssuming that this map is passed to `HTTP::Multiserver` initializer:\n\n```crystal\nmap = {\n  \"/foo\"   => foo_server,\n  %r{/bar} => bar_server,\n  \"/\"      => fallback_server\n}\n\nmultiserver = HTTP::Multiserver.new(port, map)\n```\n\nThis is how the request is dispatched under the hood (simplified):\n\n```crystal\ninternal_map = {\n  %r{^/foo/} => foo_server,\n  %r{/bar}   => bar_server,\n  %r{^/}     => fallback_server\n}\n\npath = request.path.append_slash # \"/foo/abc\" turns into \"foo/abc/\"\nserver = internal_map.find { |regex, _| regex.match(path) }\nserver ? server.call(context) : not_found\n```\n\nPlease see [specs](https://github.com/vladfaust/http-multiserver.cr/blob/master/spec/http-multiserver_spec.cr) for dispatching specifications.\n\n## Performance\n\nAs mentioned above, `HTTP::Multiserver` is just a regular `HTTP::Server` which dispatches the handling to underlying servers based on super-fast `Regex.match`. A very tiny impact on the performance is expected if any.\n\n## Contributing\n\n1. Fork it ( https://github.com/vladfaust/http-multiserver.cr/fork )\n2. Create your feature branch (git checkout -b my-new-feature)\n3. Commit your changes (git commit -am 'Add some feature')\n4. Push to the branch (git push origin my-new-feature)\n5. Create a new Pull Request\n\n## Contributors\n\n- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer\n","program":{"html_id":"github.com/vladfaust/http-multiserver.cr/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"github.com/vladfaust/http-multiserver.cr","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP","path":"HTTP.html","kind":"module","full_name":"HTTP","name":"HTTP","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"http-multiserver.cr","line_number":4,"url":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr"}],"repository_name":"github.com/vladfaust/http-multiserver.cr","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"The HTTP module contains `HTTP::Client`, `HTTP::Server` and `HTTP::WebSocket` implementations.","summary":"<p>The HTTP module contains <code>HTTP::Client</code>, <code>HTTP::Server</code> and <code>HTTP::WebSocket</code> implementations.</p>","class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP/Multiserver","path":"HTTP/Multiserver.html","kind":"class","full_name":"HTTP::Multiserver","name":"Multiserver","abstract":false,"superclass":{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP/Server","kind":"class","full_name":"HTTP::Server","name":"Server"},"ancestors":[{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP/Server","kind":"class","full_name":"HTTP::Server","name":"Server"},{"html_id":"github.com/vladfaust/http-multiserver.cr/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/vladfaust/http-multiserver.cr/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"http-multiserver.cr","line_number":5,"url":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr"}],"repository_name":"github.com/vladfaust/http-multiserver.cr","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP","kind":"module","full_name":"HTTP","name":"HTTP"},"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new(mapping:Hash(String|Regex,Server),handlers=[]ofHandler,fallback_handler:Handler::HandlerProc?=nil)-class-method","html_id":"new(mapping:Hash(String|Regex,Server),handlers=[]ofHandler,fallback_handler:Handler::HandlerProc?=nil)-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":"Hash(String | Regex, Server)"},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""},{"name":"fallback_handler","doc":null,"default_value":"nil","external_name":"fallback_handler","restriction":"Handler::HandlerProc | ::Nil"}],"args_string":"(mapping : Hash(String | Regex, Server), handlers = <span class=\"o\">[]</span> <span class=\"k\">of</span> <span class=\"t\">Handler</span>, fallback_handler : Handler::HandlerProc? = <span class=\"n\">nil</span>)","source_link":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr#L20","def":{"name":"new","args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":"Hash(String | Regex, Server)"},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""},{"name":"fallback_handler","doc":null,"default_value":"nil","external_name":"fallback_handler","restriction":"Handler::HandlerProc | ::Nil"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(mapping, handlers, fallback_handler)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}},{"id":"new(mapping,handlers=[]ofHandler)-class-method","html_id":"new(mapping,handlers=[]ofHandler)-class-method","name":"new","doc":"Create a new Multiserver","summary":"<p>Create a new Multiserver</p>","abstract":false,"args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":""},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""}],"args_string":"(mapping, handlers = <span class=\"o\">[]</span> <span class=\"k\">of</span> <span class=\"t\">Handler</span>)","source_link":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr#L11","def":{"name":"new","args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":""},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(mapping, handlers)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}},{"id":"new(mapping,handlers=[]ofHandler,&fallback_handler:Context->)-class-method","html_id":"new(mapping,handlers=[]ofHandler,&amp;fallback_handler:Context-&gt;)-class-method","name":"new","doc":"Create a new Multiserver with a custom *fallback_handler* block","summary":"<p>Create a new Multiserver with a custom <em>fallback_handler</em> block</p>","abstract":false,"args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":""},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""}],"args_string":"(mapping, handlers = <span class=\"o\">[]</span> <span class=\"k\">of</span> <span class=\"t\">Handler</span>, &fallback_handler : Context -> )","source_link":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr#L16","def":{"name":"new","args":[{"name":"mapping","doc":null,"default_value":"","external_name":"mapping","restriction":""},{"name":"handlers","doc":null,"default_value":"[] of Handler","external_name":"handlers","restriction":""}],"double_splat":null,"splat_index":null,"yields":1,"block_arg":{"name":"fallback_handler","doc":null,"default_value":"","external_name":"fallback_handler","restriction":"(Context -> )"},"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(mapping, handlers, &fallback_handler) do |_arg0|\n  yield _arg0\nend\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"close-instance-method","html_id":"close-instance-method","name":"close","doc":"Close all underlying servers and then self","summary":"<p>Close all underlying servers and then self</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr#L42","def":{"name":"close","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"@mapping.each_value(&.close)\nsuper()\n"}}],"macros":[],"types":[{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP/Multiserver/Mapping","path":"HTTP/Multiserver/Mapping.html","kind":"alias","full_name":"HTTP::Multiserver::Mapping","name":"Mapping","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"http-multiserver.cr","line_number":6,"url":"https://github.com/vladfaust/http-multiserver.cr/blob/3eb6c5338148c00cdebf3365340d96bbd60517d6/src/http-multiserver.cr"}],"repository_name":"github.com/vladfaust/http-multiserver.cr","program":false,"enum":false,"alias":true,"aliased":"Hash(Regex, HTTP::Handler | Proc(HTTP::Server::Context, Nil))","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/vladfaust/http-multiserver.cr/HTTP/Multiserver","kind":"class","full_name":"HTTP::Multiserver","name":"Multiserver"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]}]}]}]}})