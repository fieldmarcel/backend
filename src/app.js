import express from "express";
 import cors from "cors"
 import cookieParser from "cookie-parser";//
 const app= express();

 app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
 }))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser())


//route import here
import userRouter from './routes/user.routes.js'

app.use("/api/v1/users",userRouter)



export {app}













// import express from "express";
// import cors from "cors"
// import cookieParser from "cookie-parser";//
// const app= express();

// app.use(cors());


// //configuration for data got by user in terms of url json img and limit them 
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use("/api/v1/", userRouter);


// app.use((req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.url}`);
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     next();
// });




// //routes import

// import userRouter from './routes/user.routes.js';

// app.use("/api/v1/users/register", userRouter);

//  //telling version of user just profesional things

// //flow is like this url
// //http:localhost:8000/api/v1/users/register

// // Purpose:
// // app.use() is a general-purpose method to apply middleware or mount sub-applications/routers.

// // When to Use:

// // To define middleware that will execute for all or specific routes.



// export {app}



// // app.use(express.json({ limit: "16kb" }))
// // Configures the Express app to parse incoming JSON payloads in the request body.
// // limit: "16kb" sets a limit of 16 kilobytes for the size of incoming JSON data. If the request body exceeds this size, the server will reject the request with a 413 Payload Too Large error.
// // 2. app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// // Configures the app to parse URL-encoded payloads in requests, such as form submissions.
// // extended: true allows parsing nested objects in the query string using the qs library instead of the default querystring library.
// // limit: "16kb" limits the size of the payload to 16 kilobytes. Similar to JSON parsing, a request exceeding this size will be rejected.
// // 3. app.use(express.static("public"))
// // Serves static files from the public directory.
// // Examples of static files include images, stylesheets, JavaScript files, etc.
// // If you have a folder named public with files like logo.png, users can access them directly by navigating to http://yourdomain.com/logo.png.
// // Why Use These Configurations?
// // Security:

// // Limiting payload size helps protect your application from Denial of Service (DoS) attacks where large payloads could overwhelm your server.
// // Efficiency:

// // By specifying limits, you ensure your server doesn't waste resources on excessively large payloads that it may not need or handle.
// // Static File Serving:

// // Serving static files from the public directory simplifies handling resources like images or client-side assets.
// // Example Use Case
// // A user uploads a profile picture and submits a form with JSON data. The server should:

// // Parse the JSON data (limited to 16kb).
// // Parse URL-encoded data (e.g., application/x-www-form-urlencoded forms).
// // Serve a default static image (public/default-profile.png) if no image is uploaded.