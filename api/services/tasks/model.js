import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: { type: String, required: true },
  hours: { type: Number, 'default': 0 },
  cubicYards: { type: Number, 'default': 0 },
  tons: { type: Number, 'default': 0 },
  notes: { type: String, default: '' },
  completed: { type: Date },
  job: { type: ObjectId, ref: 'Job'},
  lot: { type: ObjectId, ref: 'Lot'}
}, {
  timestamps: true
});

export { TaskSchema as Schema };
export default mongoose.model('Task', TaskSchema);
