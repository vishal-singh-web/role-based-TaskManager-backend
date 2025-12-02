const  connectMongo = require("./db");
const express = require("express");
const { json } = require("express");
const  cors = require("cors");
const  authRoutes = require('./routes/auth.js');
const  tasksRoutes = require('./routes/tasks.js');
connectMongo();

const app = express();

app.use(json());
app.use(cors({
  origin: 'https://role-based-task-manager.vercel.app'
}));
app.use('/api/auth',authRoutes);
app.use('/api/tasks',tasksRoutes);


app.listen(process.env.PORT || 10000, () => {
  console.log(`Server listening on port ${process.env.PORT || 10000}`);
});


