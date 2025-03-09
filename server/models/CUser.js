import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    Id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

UserSchema.statics.incrementId = async function () {
  const lastUser = await this.findOne().sort({ Id: -1 });
  return lastUser && lastUser.Id ? lastUser.Id + 1 : 1;
};

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.Id = await this.constructor.incrementId();
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model("CUser", UserSchema);
