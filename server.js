const express = require("express");
const next = require("next");
const helmet = require("helmet");
const generateNonce = require("./generateNonce");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use((req, res, next) => {
    const nonce = generateNonce();

    res.locals.cspNonce = nonce;
    next();
  });

  server.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'strict-dynamic'",
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        styleSrc: [
          "'self'",
          // "'unsafe-inline'",
          "fonts.googleapis.com",
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        imgSrc: ["'self'"],
        frameSrc: ["'self'"],
        childSrc: ["'self'"],
        objectSrc: ["'self'"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        reportUri: ["/__cspreport__"],
        upgradeInsecureRequests: [],
      },
      loose: true,
      reportOnly: false,
      setAllHeaders: false,
      browserSniff: true,
    })
  );

  server.all("/_next/webpack-hmr", (req, res) => {
    handle(req, res);
  });

  server.post("/__cspreport__", (req, res) => {
    res.status(200).send({ message: "CSP violation reported" });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`>>> Ready on http://localhost:${port}`);
  });
});
