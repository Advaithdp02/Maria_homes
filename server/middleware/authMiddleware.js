import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You can now access user info in route via req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
