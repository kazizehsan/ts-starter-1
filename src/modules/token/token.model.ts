import mongoose, { Document, Model } from 'mongoose';
import tokenTypes from './token.types.js';
import toJSON from '../toJSON/toJSON.js';
import { ITokenBaseModel } from './token.interfaces.js';

export interface ITokenDoc extends ITokenBaseModel, Document {}
export interface ITokenModel extends Model<ITokenDoc> {}

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);

export default Token;
