import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const JobSchema = new Schema({
  name: { type: String, required: true },
  lots: [{ type: ObjectId, ref: 'Lot' }]
}, {
  timestamps: true
});

export { JobSchema as Schema };
export default mongoose.model('Job', JobSchema);
