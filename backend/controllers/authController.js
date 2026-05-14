const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizeName = (name = "") => name.trim();
const normalizePassword = (password = "") => password.trim();

const register = async (req, res) => {
  try {
    const name = normalizeName(req.body.name);
    const email = normalizeEmail(req.body.email);
    const password = normalizePassword(req.body.password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tum alanlar zorunludur." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Sifre en az 6 karakter olmalidir." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayitli." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Kayit basarili.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bu email zaten kayitli." });
    }

    return res
      .status(500)
      .json({ message: "Kayit sirasinda bir sorun olustu." });
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = normalizePassword(req.body.password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email ve sifre alanlari zorunludur." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email veya sifre hatali." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email veya sifre hatali." });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      message: "Giris basarili.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Giris sirasinda bir sorun olustu." });
  }
};

module.exports = {
  register,
  login,
};
