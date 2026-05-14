const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || "";

    if (!authorizationHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Yetkisiz erisim. Giris yapmaniz gerekiyor." });
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Kullanici bulunamadi." });
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Gecersiz veya suresi dolmus token.",
    });
  }
};

module.exports = { protect };
