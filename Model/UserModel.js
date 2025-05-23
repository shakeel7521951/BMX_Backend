import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  eligible: {
    type: String,
    default: "unverified",
  },
  userRole: {
    type: String,
    default: "User",
  },
  paymentImage: {
    type: String,
  },
  cardDetails: {
    cardNumber1: {
      type: String,
    },
    cardNumber2: {
      type: String,
    },
    cardNumber3: {
      type: String,
    },
  },
  referralLink: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  UserLevel: {
    type: Number,
    default: 1,
  },
  referredPoints: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      points: {
        type: Number,
        default: 0,
      },
      userDetails: {
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        UserLevel: {
          type: Number,
        },
        totalPointsEarned: {
          type: Number,
        },
        referralLink: {
          type: String,
        },
      },
    },
  ],
  dailyPoints: {
    count: {
      type: Number,
      default: 0,
    },
    lastClaimDate: {
      type: Date,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  totalPointsEarned: {
    type: Number,
    default: 0,
  },
  convertedPointsInPKR: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.generateOTP = async function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  this.otp = otp;
  this.otpExpires = Date.now() + 5 * 60 * 1000;
  await this.save();
  return otp;
};

UserSchema.methods.verifyOTP = function (enteredOTP) {
  if (this.otp !== enteredOTP || Date.now() > this.otpExpires) return false;
  return true;
};

UserSchema.pre("save", function (next) {
  if (this.isModified("dailyPoints") && this.dailyPoints.totalPoints === 0) {
    this.totalPointsEarned = this.totalPointsEarned;
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("totalPointsEarned") || this.isNew) {
    this.UserLevel = Math.min(
      100,
      Math.floor(this.totalPointsEarned / 5000) + 1
    );
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.referralLink) {
    const sanitizedUsername = this.name.toLowerCase().replace(/\s+/g, "-");
    this.referralLink = `${sanitizedUsername}/referral/${this._id}`;
  }
  next();
});

UserSchema.pre("save", function (next) {
  if (this.isModified("referredPoints")) {
    const referralCount = this.referredPoints?.length || 0;
    let newLevel = this.UserLevel || 1; // Keep current level as default

    if (referralCount >= 20) {
      newLevel = 4;
    } else if (referralCount >= 10) {
      newLevel = 3;
    } else if (referralCount >= 3) {
      newLevel = 2;
    }

    // Only update if the new level is higher than current
    if (newLevel > this.UserLevel) {
      this.UserLevel = newLevel;
    }
  }
  next();
});

const generateUniqueNumber = async (length, field, model) => {
  let isUnique = false;
  let randomNumber;

  while (!isUnique) {
    randomNumber = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const exists = await model.exists({
      [`cardDetails.${field}`]: randomNumber,
    });
    if (!exists) {
      isUnique = true;
    }
  }

  return randomNumber;
};

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const User = this.constructor;

    this.cardDetails = {
      cardNumber1: await generateUniqueNumber(3, "cardNumber1", User),
      cardNumber2: await generateUniqueNumber(5, "cardNumber2", User),
      cardNumber3: await generateUniqueNumber(2, "cardNumber3", User),
    };
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model("User", UserSchema);