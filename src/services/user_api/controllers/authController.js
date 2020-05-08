const User = require('../models/user');

exports.register = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({
      status: 'success',
      user: savedUser
    });
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      error: err.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      error: 'Username or email is invalid'
    });
  }

  if (!user.comparePasswords(password)) {
    return res.status(404).json({
      status: 'fail',
      error: 'Username or email is invalid'
    });
  }

  const token = await user.generateToken();

  return res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  // Check if user is registered with provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with that email address', 404));

  // Generate random reset token
  const resetToken = user.createToken('resetPassword');
  await user.save({ validateBeforeSave: false });

  try {
    // Send the token back as reset link
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'Success',
      message: 'Reset token sent to email address'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending email. Try again later', 500));
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {};

// Confirm Account
exports.confirmAccount = async (req, res) => {};

// Protect routes
exports.protect = async (req, res) => {};

// Restrict access to user roles
exports.restrictTo = async (req, res) => {};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  await User.findOneAndUpdate({ email: req.authUser.email }, { password: Bcrypt.hashSync(password) });

  await PasswordReset.findOneAndDelete({ email: req.authUser.email });

  return res.json({
    message: 'Password has been reset.'
  });
};

const resendEmailConfirm = async (req, res) => {
  if (!req.authUser.emailConfirmedAt) {
    await req.authUser.sendEmailVerificationEmail();
  }

  return res.json({
    message: 'Email confirmation resent.'
  });
};

const emailConfirm = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.authUser.email },
    {
      emailConfirmCode: null,
      emailConfirmedAt: new Date()
    },
    { new: true }
  );

  const token = user.generateToken();

  return res.json({
    message: 'Email confirmed.',
    data: {
      user,
      token
    }
  });
};
