import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "guest"],
      default: "user",
    },
    rank: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const isAValidUsername = (value) => {
  // Ensure the username does not contain spaces
  return validator.matches(value, /^[^\s]+$/); // No spaces allowed
};

userSchema.statics.signup = async function (username, email, password) {
  if (!email || !password || !username) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw Error("Password is not strong enough");
  }

  if (!isAValidUsername(username)) {
    throw Error("Username is not valid");
  }

  const existEmail = await this.findOne({ email });

  if (existEmail) {
    throw Error("Email is already in use");
  }

  const existUsername = await this.findOne({ username });

  if (existUsername) {
    throw Error("Username is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ username, email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid credentials");
  }
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
