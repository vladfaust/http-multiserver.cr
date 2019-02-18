# HTTP::Multiserver

[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)
[![Build status](https://img.shields.io/travis/vladfaust/http-multiserver.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/http-multiserver.cr)
[![API Docs](https://img.shields.io/badge/api_docs-online-brightgreen.svg?style=flat-square)](https://github.vladfaust.com/http-multiserver.cr)
[![Releases](https://img.shields.io/github/release/vladfaust/http-multiserver.cr.svg?style=flat-square)](https://github.com/vladfaust/http-multiserver.cr/releases)
[![Awesome](https://github.com/vladfaust/awesome/blob/badge-flat-alternative/media/badge-flat-alternative.svg)](https://github.com/veelenga/awesome-crystal)
[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)
[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)

The requests dispatcher shard for [Crystal](https://crystal-lang.org/).

[![Become a Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)

## About

`HTTP::Multiserver` dispatches a server request to another vanilla `HTTP::Server` depending on its path similar to Ruby's [Rack::URLMap](http://www.rubydoc.info/gems/rack/Rack/URLMap).

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  http-multiserver:
    github: vladfaust/http-multiserver.cr
    version: ~> 0.2.0
```

This shard follows [Semantic Versioning 2.0.0](https://semver.org/), so see [releases](https://github.com/vladfaust/http-multiserver.cr/releases) and change the `version` accordingly.

## Usage

### Basic example

```crystal
require "http-multiserver"

simple_server = HTTP::Server.new([HTTP::LogHandler.new]) do |context|
  context.response.print("Hello from Simple Server!")
end

# For example purposes
resque = Resque::Server.new

multiserver = HTTP::Multiserver.new({
  "/resque" => resque,
  "/"       => simple_server,
}, [HTTP::ErrorHandler.new(true)]) do |context|
  # This is an optional custom fallback handler; by default returns "404 Not Found"
  context.response.status_code = 418
  context.response.print("☕ #{context.request.path} not found")
end

multiserver.bind_tcp(5000)
multiserver.listen
```

`HTTP::Multiserver` extends from a regular `HTTP::Server`, so it *CAN* have its own handlers. Same for underlying servers, they obviously *CAN* have their own handlers too.

### Mapping

Mapping relies on either `String` or `Regex` keys; when using `String` as a key, a slash is automatically appended to it.

Assuming that this map is passed to `HTTP::Multiserver` initializer:

```crystal
map = {
  "/foo"   => foo_server,
  %r{/bar} => bar_server,
  "/"      => fallback_server
}

multiserver = HTTP::Multiserver.new(port, map)
```

This is how the request is dispatched under the hood (simplified):

```crystal
internal_map = {
  %r{^/foo/} => foo_server,
  %r{/bar}   => bar_server,
  %r{^/}     => fallback_server
}

path = request.path.append_slash # "/foo/abc" turns into "foo/abc/"
server = internal_map.find { |regex, _| regex.match(path) }
server ? server.call(context) : not_found
```

Please see [specs](https://github.com/vladfaust/http-multiserver.cr/blob/master/spec/http-multiserver_spec.cr) for dispatching specifications.

## Performance

As mentioned above, `HTTP::Multiserver` is just a regular `HTTP::Server` which dispatches the handling to underlying servers based on super-fast `Regex.match`. A very tiny impact on the performance is expected if any.

## Contributing

1. Fork it ( https://github.com/vladfaust/http-multiserver.cr/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer
