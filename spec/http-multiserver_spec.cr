require "./spec_helper"

port = 5042

foo = uninitialized HTTP::Server
bar = uninitialized HTTP::Server
fallback = uninitialized HTTP::Server

{% for x in %w(foo bar fallback) %}
  {{x.id}} = HTTP::Server.new do |context|
    context.response.tap(&.print("Hello from #{{{x}}}!")).close
  end
{% end %}

multiserver = HTTP::Multiserver.new({
  "/foo"   => foo,
  %r{/bar} => bar,
  "/"      => fallback,
})

describe HTTP::Multiserver do
  it "works as expected" do
    spawn do
      multiserver.bind_tcp(port)
      multiserver.listen
    end

    sleep 0.5

    response = HTTP::Client.get("http://localhost:#{port}/bar/foo")
    response.body.should eq "Hello from bar!"
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
