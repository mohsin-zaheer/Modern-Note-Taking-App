import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("No user found with this token");
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("JWT error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};



export default protect;
