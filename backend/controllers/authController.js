const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalıdır." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "Kayıt başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Kayıt sırasında hata oluştu." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre zorunludur." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email veya şifre hatalı." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email veya şifre hatalı." });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Giriş başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu." });
  }
};

module.exports = {
  register,
  login,
};