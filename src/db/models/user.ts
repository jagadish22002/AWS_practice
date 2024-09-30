import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Create the user schema
const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Mongoose model
const User = mongoose.model<IUser>('User', UserSchema);


export default User;
