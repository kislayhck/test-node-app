const jwt = require('jsonwebtoken');

const generateToken = (userId, email) => {
  const token = jwt.sign(
    {
      userId,
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
