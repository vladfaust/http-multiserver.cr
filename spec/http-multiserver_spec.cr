require "./spec_helper"

port = 0

foo = uninitialized HTTP::Server
bar = uninitialized HTTP::Server
fallback = uninitialized HTTP::Server

{% for x in %w(foo bar fallback) %}
  {{x.id}} = HTTP::Server.new(port) do |context|
    context.response.tap(&.printf("Hello from #{{{x}}}!")).close
  end
{% end %}

multiserver = HTTP::Multiserver.new(port, {
  "/foo"   => foo,
  %r{/bar} => bar,
  "/"      => fallback,
})

describe HTTP::Multiserver do
  # Just check if there are no any compilation errors ¯\_(ツ)_/¯
  it "works" do
    spawn do
      multiserver.listen
    end

    sleep 0.001
  end

  describe "#dispatch" do
    {% begin %}
      # This shows how an incoming request should be dispatched
      {% map = {
           "/foo"        => "foo",
           "/foo/"       => "foo",
           "/foo/bar"    => "foo",
           "/foo/bar/42" => "foo",
           "/fo"         => "fallback",
           "/foobar"     => "fallback",
           "/bar"        => "bar",
           "/bar/"       => "bar",
           "/bar/foo"    => "bar",
           "/barbaz"     => "bar",
           "/bar/baz"    => "bar",
           "/ba"         => "fallback",
           "/baz"        => "fallback",
           "/baz/"       => "fallback",
           "/"           => "fallback",
         } %}

      {% for path, handler in map %}
        it "dispatches {{path.id}} to {{handler.id}}" do
          multiserver.dispatch({{path}}).should eq {{handler.id}}.processor.handler
        end
      {% end %}
    {% end %}
  end
end
