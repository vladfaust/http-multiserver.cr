# :nodoc:
class String
  def append_slash
    self[-1] == '/' ? self : (self + "/")
  end
end
