import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({
  extended:true,
  limit:"16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/likes.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// Routes Declaration
const apiVersion = "/api/v1/"
app.use(`${apiVersion}healthcheck`, healthcheckRouter)
app.use(`${apiVersion}users`, userRouter)
app.use(`${apiVersion}tweets`, tweetRouter)
app.use(`${apiVersion}subscriptions`, subscriptionRouter)
app.use(`${apiVersion}videos`, videoRouter)
app.use(`${apiVersion}comments`, commentRouter)
app.use(`${apiVersion}likes`, likeRouter)
app.use(`${apiVersion}playlist`, playlistRouter)
app.use(`${apiVersion}dashboard`, dashboardRouter)

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  let status = err.statusCode || err.code || 500
  
  // Validate status code is a valid HTTP status code
  if (typeof status !== 'number' || status < 100 || status > 599) {
    status = 500
  }
  
  const message = err.message || "Something went wrong"
  
  return res.status(status).json({
    statusCode: status,
    data: null,
    message: message,
    success: false
  })
})

export default app;