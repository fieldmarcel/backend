import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`server running at ${process.env.PORT}`);
//     });
//     // Here, the console.log runs only after the server has successfully started 
//     // listening on the specified port. This ensures you only see the log if app
//     // .listen completes successfully.
//   })
//   .catch((err) => {
//     console.log("mongodb connection failed", err);
//   });

const startServer =async ()=>{
  try {
  await connectDB();
  const PORT=  8000;
  app.listen(PORT,()=>{
    console.log(`Server running a port ${PORT}`);
  })
  } catch (error) {
    console.log("mongoDB connection failed ",error.message)
  }
}

startServer()


// Using console.log Directly
// javascript
// Copy code
// app.listen(PORT);
// console.log(`Server running at port ${PORT}`);
// What Happens?
// Non-Blocking Behavior:
// app.listen is asynchronous. Writing console.log immediately after 
// doesn't guarantee that the server has actually started listening 
// on the port. The server could fail to start for various reasons 
// (e.g., the port is already in use), but your log would still execute,
//  which could mislead you into thinking the server is running.