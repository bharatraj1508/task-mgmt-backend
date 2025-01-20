var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    try {
      User.findById(jwt_payload.userId).then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err, false);
    }
  })
);
