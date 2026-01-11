import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const productionOrigins = [process.env.PROD_ORIGIN1].filter(Boolean);
const devOrigins = [process.env.DEV_ORIGIN1].filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === "production" ? productionOrigins : devOrigins;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);


app.use(express.json({
  limit: "16kb"
}))

app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
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
import feedRouter from "./routes/feed.routes.js"

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
app.use(`${apiVersion}feed`, feedRouter)

export default app;