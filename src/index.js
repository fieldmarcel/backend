import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server running at ${process.env.PORT}`);
    });
    // Here, the console.log runs only after the server has successfully started 
    // listening on the specified port. This ensures you only see the log if app
    // .listen completes successfully.
  })
  .catch((err) => {
    console.log("mongodb connection failed", err);
  });
