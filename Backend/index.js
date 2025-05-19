import express from 'express';                  
import connectDb from './config/db.js'; 
import UserRouter from './routes/user.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.get('/', (req, res) => {
    res.send('All Good 💀 !');
});

app.use('user', UserRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
