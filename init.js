const fs = require('fs');
const path = require('path');

const dirs = [
  'src/config',
  'src/constants',
  'src/controllers',
  'src/middleware',
  'src/models',
  'src/routes',
  'src/services',
  'src/validators',
  'src/utils',
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  'package.json': `{
  "name": "eve-healthcare-backend",
  "version": "1.0.0",
  "description": "EVE Healthcare Diagnostic Booking System",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
  '.env': `PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eve_healthcare
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d`,
  '.env.example': `PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eve_healthcare
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d`,
  'src/constants/index.js': `export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};

export const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN"
};`,
  'src/utils/ApiResponse.js': `class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
export default ApiResponse;`,
  'src/utils/ApiError.js': `class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;`,
  'src/utils/catchAsync.js': `const catchAsync = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export default catchAsync;`,
  'src/utils/paymentSimulator.js': `import { PAYMENT_STATUS } from '../constants/index.js';

export const simulatePayment = () => {
  return Math.random() > 0.2 ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED;
};`,
  'src/config/db.js': `import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB connected: \${connectionInstance.connection.host}\`);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};
export default connectDB;`,
  'src/middleware/error.middleware.js': `import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }
  
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  };

  return res.status(error.statusCode).json(response);
};`,
  'src/middleware/auth.middleware.js': `import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});`,
  'src/middleware/logger.middleware.js': `import morgan from 'morgan';

export const requestLogger = morgan('dev');`,
  'src/models/User.js': `import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USER_ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, email: this.email, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export default mongoose.model('User', userSchema);`,
  'src/models/Centre.js': `import mongoose from 'mongoose';

const centreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Centre', centreSchema);`,
  'src/models/Test.js': `import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }
}, { timestamps: true });

export default mongoose.model('Test', testSchema);`,
  'src/models/Booking.js': `import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../constants/index.js';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
  appointmentDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);`,
  'src/models/Payment.js': `import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constants/index.js';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(PAYMENT_STATUS), required: true },
  transactionId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);`,
  'src/models/WebhookEvent.js': `import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  processed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('WebhookEvent', webhookEventSchema);`,
  'src/validators/auth.validator.js': `import { body } from 'express-validator';

export const signupValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];`,
  'src/validators/centre.validator.js': `import { body } from 'express-validator';

export const createCentreValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required')
];`,
  'src/validators/test.validator.js': `import { body } from 'express-validator';

export const createTestValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('centreId').isMongoId().withMessage('Valid Centre ID is required')
];`,
  'src/validators/booking.validator.js': `import { body } from 'express-validator';

export const createBookingValidator = [
  body('testId').isMongoId().withMessage('Valid Test ID is required'),
  body('centreId').isMongoId().withMessage('Valid Centre ID is required'),
  body('appointmentDate').isISO8601().toDate().withMessage('Valid Appointment Date is required')
];`,
  'src/validators/payment.validator.js': `import { body } from 'express-validator';

export const createPaymentValidator = [
  body('bookingId').isMongoId().withMessage('Valid Booking ID is required')
];

export const webhookValidator = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('bookingId').isMongoId().withMessage('Valid Booking ID is required'),
  body('status').notEmpty().withMessage('Status is required')
];`,
  'src/services/auth.service.js': `import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const signupUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }
  const user = await User.create(userData);
  const createdUser = await User.findById(user._id).select("-password");
  return createdUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");
  return { user: loggedInUser, accessToken };
};`,
  'src/services/centre.service.js': `import Centre from '../models/Centre.js';

export const createCentre = async (centreData) => {
  return await Centre.create(centreData);
};

export const getCentres = async () => {
  return await Centre.aggregate([
    {
      $lookup: {
        from: 'tests',
        localField: '_id',
        foreignField: 'centreId',
        as: 'tests'
      }
    }
  ]);
};`,
  'src/services/test.service.js': `import Test from '../models/Test.js';
import Centre from '../models/Centre.js';
import ApiError from '../utils/ApiError.js';

export const createTest = async (testData) => {
  const centre = await Centre.findById(testData.centreId);
  if (!centre) {
    throw new ApiError(404, "Centre not found");
  }
  return await Test.create(testData);
};

export const getTests = async (centreId) => {
  const filter = centreId ? { centreId } : {};
  return await Test.find(filter).populate('centreId', 'name location');
};`,
  'src/services/bookingCalculation.service.js': `import Test from '../models/Test.js';
import ApiError from '../utils/ApiError.js';

export const calculateAmount = async (testId) => {
  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }
  return test.price;
};`,
  'src/services/booking.service.js': `import Booking from '../models/Booking.js';
import Centre from '../models/Centre.js';
import Test from '../models/Test.js';
import { calculateAmount } from './bookingCalculation.service.js';
import ApiError from '../utils/ApiError.js';

export const createBooking = async (userId, bookingData) => {
  const centre = await Centre.findById(bookingData.centreId);
  if (!centre) throw new ApiError(404, "Centre not found");

  const test = await Test.findById(bookingData.testId);
  if (!test) throw new ApiError(404, "Test not found");
  if (test.centreId.toString() !== centre._id.toString()) {
    throw new ApiError(400, "Test does not belong to the selected Centre");
  }

  const amount = await calculateAmount(bookingData.testId);

  return await Booking.create({
    userId,
    testId: bookingData.testId,
    centreId: bookingData.centreId,
    appointmentDate: bookingData.appointmentDate,
    amount
  });
};

export const getUserBookings = async (userId) => {
  return await Booking.find({ userId }).populate('testId centreId');
};

export const deleteBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw new ApiError(404, "Booking not found");
  await Booking.deleteOne({ _id: bookingId });
  return booking;
};`,
  'src/services/payment.service.js': `import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import WebhookEvent from '../models/WebhookEvent.js';
import { simulatePayment } from '../utils/paymentSimulator.js';
import ApiError from '../utils/ApiError.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/index.js';

export const processPayment = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  const status = simulatePayment();
  const transactionId = new mongoose.Types.ObjectId().toString();

  const payment = await Payment.create({
    bookingId,
    amount: booking.amount,
    status,
    transactionId
  });

  return payment;
};

export const handleWebhook = async (eventId, bookingId, status) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingEvent = await WebhookEvent.findOne({ eventId }).session(session);
    if (existingEvent) {
      await session.abortTransaction();
      session.endSession();
      return { message: "Event already processed" };
    }

    await WebhookEvent.create([{ eventId, processed: true }], { session });

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) throw new ApiError(404, "Booking not found");

    if (status === PAYMENT_STATUS.SUCCESS) {
      booking.status = BOOKING_STATUS.CONFIRMED;
    } else {
      booking.status = BOOKING_STATUS.FAILED;
    }
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    return { message: "Webhook processed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};`,
  'src/controllers/auth.controller.js': `import { signupUser, loginUser } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const signup = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const user = await signupUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());

  const { email, password } = req.body;
  const { user, accessToken } = await loginUser(email, password);

  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };
  res.status(200).cookie("accessToken", accessToken, options).json(
    new ApiResponse(200, { user, accessToken }, "User logged in successfully")
  );
});`,
  'src/controllers/centre.controller.js': `import { createCentre, getCentres } from '../services/centre.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const addCentre = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const centre = await createCentre(req.body);
  res.status(201).json(new ApiResponse(201, centre, "Centre created successfully"));
});

export const getAllCentres = catchAsync(async (req, res) => {
  const centres = await getCentres();
  res.status(200).json(new ApiResponse(200, centres, "Centres fetched successfully"));
});`,
  'src/controllers/test.controller.js': `import { createTest, getTests } from '../services/test.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const addTest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const test = await createTest(req.body);
  res.status(201).json(new ApiResponse(201, test, "Test created successfully"));
});

export const getTestsByCentre = catchAsync(async (req, res) => {
  const tests = await getTests(req.query.centreId);
  res.status(200).json(new ApiResponse(200, tests, "Tests fetched successfully"));
});`,
  'src/controllers/booking.controller.js': `import { createBooking, getUserBookings, deleteBooking } from '../services/booking.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const bookTest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const booking = await createBooking(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await getUserBookings(req.user._id);
  res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export const removeBooking = catchAsync(async (req, res) => {
  await deleteBooking(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, "Booking deleted successfully"));
});`,
  'src/controllers/payment.controller.js': `import { processPayment, handleWebhook } from '../services/payment.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const initiatePayment = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const payment = await processPayment(req.body.bookingId);
  res.status(200).json(new ApiResponse(200, payment, "Payment initiated"));
});

export const paymentWebhook = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const { eventId, bookingId, status } = req.body;
  const result = await handleWebhook(eventId, bookingId, status);
  res.status(200).json(new ApiResponse(200, result, "Webhook handled"));
});`,
  'src/routes/auth.routes.js': `import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { signupValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);

export default router;`,
  'src/routes/centre.routes.js': `import { Router } from 'express';
import { addCentre, getAllCentres } from '../controllers/centre.controller.js';
import { createCentreValidator } from '../validators/centre.validator.js';

const router = Router();

router.post('/', createCentreValidator, addCentre);
router.get('/', getAllCentres);

export default router;`,
  'src/routes/test.routes.js': `import { Router } from 'express';
import { addTest, getTestsByCentre } from '../controllers/test.controller.js';
import { createTestValidator } from '../validators/test.validator.js';

const router = Router();

router.post('/', createTestValidator, addTest);
router.get('/', getTestsByCentre);

export default router;`,
  'src/routes/booking.routes.js': `import { Router } from 'express';
import { bookTest, getMyBookings, removeBooking } from '../controllers/booking.controller.js';
import { createBookingValidator } from '../validators/booking.validator.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.post('/', createBookingValidator, bookTest);
router.get('/', getMyBookings);
router.delete('/:id', removeBooking);

export default router;`,
  'src/routes/payment.routes.js': `import { Router } from 'express';
import { initiatePayment, paymentWebhook } from '../controllers/payment.controller.js';
import { createPaymentValidator, webhookValidator } from '../validators/payment.validator.js';

const router = Router();

router.post('/', createPaymentValidator, initiatePayment);
router.post('/webhook', webhookValidator, paymentWebhook);

export default router;`,
  'src/routes/index.js': `import { Router } from 'express';
import authRoutes from './auth.routes.js';
import centreRoutes from './centre.routes.js';
import testRoutes from './test.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/centres', centreRoutes);
router.use('/tests', testRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;`,
  'src/app.js': `import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(compression());
app.use(requestLogger);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: "Server Running" });
});

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

export default app;`,
  'src/server.js': `import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(\`Server is running at port : \${port}\`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log("Project generated successfully!");
