import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // allow frontend to send cookies 
}))

app.use(express.json())
app.use(express.urlencoded({extended:true , limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())



import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);



// Errors
import { ApiError } from "./utils/ApiError.js";

app.use((err, req, res, next) => {
  console.log("Error caught:", err); // debug log

  if (err instanceof ApiError) {
    console.log("Hell o ins ",err.message)
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
      data: err.data,
    });
  }

  // fallback for unhandled errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});


export {app};