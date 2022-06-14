const generateCSP = ({ nonce }) => {
  const policy = {};

  // adder function for our policy object
  const add = (directive, value, options = {}) => {
    if (options.devOnly && process.env.NODE_ENV !== "development") return;
    const curr = policy[directive];
    policy[directive] = curr ? [...curr, value] : [value];
  };

  // default-src
  add("default-src", `'none'`);

  // script-src
  add("script-src", `'self'`);
  add("script-src", `'unsafe-eval'`, { devOnly: true });

  // style-src
  add("style-src", `'self'`);
  add("style-src", `fonts.googleapis.com`);
  add("style-src", `'nonce-${nonce}'`);

  // connect-src
  add("connect-src", `'self'`, { devOnly: true });

  // img-src
  add("img-src", `'self'`);
  add("img-src", `data:`);

  // font-src
  add("font-src", `fonts.gstatic.com`);

  // return the object in a formatted value (this won't work on IE11 without a polyfill!)
  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

export default generateCSP;
