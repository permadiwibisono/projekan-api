const debug = require('debug')('app:startup');
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const dotenv = require('dotenv');
const app = express();
const dayjs = require('dayjs');
require('dayjs/locale/id');
dayjs.locale('id');

dotenv.config();
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
debug("cors enabled");
app.use(helmet());
debug("helmet enabled");
app.use(hpp());
debug("hpp enabled");

app.use(morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"));
debug("morgan enabled");

if(app.get("env") === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  //  apply to all requests
  app.use(limiter);
  debug("express-rate-limit enabled");
}

const PORT = process.env.PORT || 5000;

app.get('/', (_, res) => res.json({ message: "Hello world", statusCode: 200 }))

app.listen(PORT, () => debug(`Listening on PORT ${PORT}...`, dayjs().format()));