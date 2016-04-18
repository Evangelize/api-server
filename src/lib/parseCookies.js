export default (headers, name) => {
  let cache = {},
      header, match, value, remote, data, index;
  const getPattern = function(name)  {
    if (cache[name]) return cache[name]

    return cache[name] = new RegExp(
      "(?:^|;) *" +
      name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
      "=([^;]*)"
    )
  };

  let cookies = headers["cookie"]
  if (!cookies) return

  match = cookies.match(getPattern(name))
  if (!match) return

  value = match[1]

  return value;
}
