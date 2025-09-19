import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));

app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
} ));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

//importing routes
import healthcheckRoutes from './routes/healthcheck.routes.js';
import authRoutes from './routes/auth.routes.js';

app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/instagram', (req, res) => {
  res.send('Hello Instagram!')
})  


app.use((err, req, res, next) => {
  console.error(err); // logs the actual error in console

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Something went wrong!"
  });
});



export default app;