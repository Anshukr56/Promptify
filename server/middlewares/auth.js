import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token 👉", tokenDecode); // 🔍 debug

    if (tokenDecode.id) {
      // ensure req.body is an object
      if (!req.body) req.body = {};

      req.body.userId = tokenDecode.id; // ✅ used later in controller
      return next();
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }
  } catch (error) {
    console.log("JWT ERROR 👉", error);
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
