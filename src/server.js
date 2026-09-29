import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });