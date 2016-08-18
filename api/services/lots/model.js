import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LotSchema = new Schema({
  lotNumber: { type: String, required: true },
  name: { type: String },
  tasks: [{ type: ObjectId, ref: 'Task'}],
  job: { type: ObjectId, ref: 'Job'}
}, {
  timestamps: true
});

export { LotSchema as Schema };
export default mongoose.model('Lot', LotSchema);
