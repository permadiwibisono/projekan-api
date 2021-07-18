const debug = require('debug')('app:startup');
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const helmet = require('helmet');
const dayjs = require('dayjs');
const app = express();
require('dayjs/locale/id');
dayjs.locale('id');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


if(app.get("env") === 'development') {
  app.use(morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"));
  debug("Morgan enabled");
}

const PORT = process.env.PORT || 5000;

app.get('/', (_, res) => res.json({ message: "Hello world", statusCode: 200 }))

app.listen(PORT, () => debug(`Listening on PORT ${PORT}...`, dayjs().format()));