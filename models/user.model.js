const { model } = require("mongoose");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        username: {
          type: String,
          trim: true,
          required: [true, 'Username is Required'],
          unique: true
        },
        email: {
          type: String,
          required: [true, 'Email is Required'],
          unique: true,
          match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
          trim: true
        },
        passwordHash: {
          type: String,
          required: true
        },
        verified: {
          type: Boolean,
          default: true
        }
        // admin: {type: Boolean, default: false}
      },
      {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
      }
)
const User = mongoose.model('User', userSchema);

module.exports = User;