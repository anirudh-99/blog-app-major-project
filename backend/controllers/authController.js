const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //remove password
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    message: "user registered successfully",
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role, profilePicture } = { ...req.body };
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    profilePicture,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exists
  if (!email || !password) {
    return next(new AppError("please provide email and password!", 400));
  }

  // 2) check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) if everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2) verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
