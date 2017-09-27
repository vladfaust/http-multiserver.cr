# HTTP::Multiserver

Crystal requests dispatcher.

[![Build Status](https://travis-ci.org/vladfaust/http-multiserver.cr.svg?branch=master)](https://travis-ci.org/vladfaust/http-multiserver.cr) [![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://vladfaust.com/http-multiserver.cr) [![Dependencies](https://shards.rocks/badge/github/vladfaust/http-multiserver.cr/status.svg)](https://shards.rocks/github/vladfaust/http-multiserver.cr) [![GitHub release](https://img.shields.io/github/release/vladfaust/http-multiserver.cr.svg)](https://github.com/vladfaust/http-multiserver.cr/releases)

## About

`HTTP::Multiserver` dispatches a server request to another vanilla `HTTP::Server` depending on its path (a.k.a. Ruby's [Rack::URLMap](http://www.rubydoc.info/gems/rack/Rack/URLMap)).

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  http-multiserver:
    github: vladfaust/http-multiserver.cr
    version: ~> 0.1.0
```

## Usage

### Basic example

```crystal
require "http-multiserver"

port = 5000

# Note that underlying servers' ports don't matter
simple_server = HTTP::Server.new(0, [HTTP::LogHandler.new]) do |context|
  context.response.printf("Hello from Simple Server!")
  context.response.close
end

# For example purposes
resque = Resque::Server.new

multiserver = HTTP::Multiserver.new(port, {
  "/resque" => resque,
  "/"       => simple_server,
}, [HTTP::ErrorHandler.new(true)]) do |context|
  # This is an optional custom fallback handler; by default returns "404 Not Found"
  context.response.status_code = 200
  context.response.printf("Not found: #{context.request.path}")
  context.response.close
end

puts "Multiserver is running on #{port}!"
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

## Credits

- Logo font: [HVD Comic Serif Pro](https://www.fontsquirrel.com/fonts/hvd-comic-serif-pro)
- Logo image: [EmojiOne](https://www.emojione.com/)
