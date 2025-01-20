const jwt = require("jsonwebtoken");

const newAccessToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.SECRET, {
    expiresIn: "1d",
  });

  return token;
};

module.exports = {
  newAccessToken,
};
