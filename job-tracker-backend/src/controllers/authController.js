const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET;

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: "Server auth configuration error" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: "Server auth configuration error" });
    }

    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Logged-in User
exports.getMe = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};
