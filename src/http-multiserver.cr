require "http/server"
require "./http-multiserver/ext/**"

module HTTP
  class Multiserver < HTTP::Server
    DEFAULT_HOST = "127.0.0.1"

    alias Mapping = Hash(Regex, Handler | Handler::Proc)

    @mapping = Mapping.new

    # Create a new Multiserver binded to `DEFAULT_HOST`
    def initialize(port, mapping, handlers = [] of Handler)
      initialize(DEFAULT_HOST, port, mapping, handlers)
    end

    # Create a new Multiserver binded to `DEFAULT_HOST` with a custom *fallback_handler* block
    def initialize(port, mapping, handlers = [] of Handler, &@fallback_handler : Context ->)
      initialize(DEFAULT_HOST, port, mapping, handlers, fallback_handler)
    end

    def initialize(@host : String, @port : Int32, mapping : Hash(String | Regex, Server), handlers = [] of Handler, @fallback_handler : Handler::Proc? = nil)
      mapping.each do |path, server|
        @mapping[path.is_a?(Regex) ? path : Regex.new("^" + path.append_slash)] = server.processor.handler
      end

      handler = Handler::Proc.new do |context|
        matching_handler = dispatch(context.request.path)

        if matching_handler
          matching_handler.call(context)
        elsif @fallback_handler
          @fallback_handler.not_nil!.call(context)
        else
          context.response.respond_with_error("Not Found", 404)
          context.response.close
        end
      end

      @processor = Server::RequestProcessor.new(handlers.any? ? self.class.build_middleware(handlers, handler) : handler)
    end

    # Close all underlying handlers and then self
    def close
      @mapping.each_value &.close
      super
    end

    # :nodoc:
    def dispatch(path)
      @mapping.find { |regex, _| regex.match(path.append_slash) }.try &.[1]
    end
  end
end
