import express from "express";
import AuthenticationRouter from "./routers/auth.router.js";
import ProfileRouter from "./routers/profile.router.js";
import LoginRouter from "./routers/login.router.js";
import requireAuth from "./middleware/requireAuth.js";
import logAndTime from "./middleware/logAndTime.js";
import { publicPath } from "./util.js";
import isAuth from "./middleware/isAuth.js";
import isInactive from "./middleware/isInactive.js";

const port = 5500;
const app = express();

// Register a custom middleware for logging incoming requests
app.use(logAndTime);

// Register a middleware that adds support for a URL encoded request body
// This is needed in order to send data to express using a FORM with a POST action
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(isAuth);
app.use("/api", AuthenticationRouter.publicRouter);
app.use("/api", requireAuth, AuthenticationRouter.privateRouter);

app.use("/", LoginRouter.publicRouter);
app.use(
  express.static(publicPath, { index: false }),
  requireAuth,
  isInactive,
  ProfileRouter.privateRouter
);

// Serve static files
app.use(express.static(publicPath));

app.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
