import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';


const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));

app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//importing routes
import healthcheckRoutes from './routes/healthcheck.routes.js';
import router from './routes/auth.routes.js';

app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/auth', router);


app.use((err, req, res, next) => {
  console.error(err); // logs the actual error in console

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Something went wrong!"
  });
});



export default app;