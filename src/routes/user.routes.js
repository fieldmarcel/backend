import { Router } from "express";
import { logoutUser,loginUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js"; // Adjust the path as needed
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([//this upload.field from multer is used for handling to post/get the files on server
    {
      name: "avatar",
      maxCount: 1,
    },

    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser//this is for data handling only
);

router.route("/login").post(loginUser)



//secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);


export default router;
// This connects the handler to the /register route
// Purpose:
// app.post() is used to define a route specifically for handling HTTP POST requests.

// When to Use:

// To handle a POST request made to a specific URL.
// Typically used when a client sends data to the server (e.g., form submissions, API calls with a payload).

// When a client makes a POST request to /users/register:

// The server matches the route /users with app.use("/users", userRouter).
// Inside userRouter, it matches /register with router.route("/register").
// The POST handler (registerUser) is called to process the request.
