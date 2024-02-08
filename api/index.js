const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes/routes.js');
const { errorHandling } = require('./src/midellware/errorHandling.js');

const PORT = process.env.PORT || 3012;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({
   extended: false
}));
app.use(express.json());

app.use(routes);
app.use(errorHandling);

app.listen(PORT, () => {
   console.log(`Server run in the port ${PORT}`);
})