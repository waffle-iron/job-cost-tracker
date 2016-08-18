import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String },
  email: { type: String },
  nickname: { type: String },
  name: { type: String },
  picture: { type: String },
  roles: [{ type: String }]
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

UserSchema.virtual('user_id').get(function() {
    return this._id;
  })
  .set(function(user_id) {
    this._id = user_id;
  });

export { UserSchema as Schema };
export default mongoose.model('User', UserSchema);
