const express = require('express');
const mongoose = require('mongoose');
const reportRoute = require('./routes');

const app = express();
app.use(express.json());
// connect here mongoose
mongoose.connect('mongodb://localhost:27017/assignment2', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error('MongoDB error:', err));

app.use('/api', reportRoute);
//listen port
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
