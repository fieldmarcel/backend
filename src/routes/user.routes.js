import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js"; // Adjust the path as needed


const router =Router()
router.route("/register").post(registerUser)
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

