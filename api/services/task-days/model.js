import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TaskDaySchema = new Schema({
  job: { type: ObjectId, ref: 'Job', required: true },
  hours: { type: Number, required: true },
  cubicYards: { type: Number, required: true },
  tons: { type: Number, required: true },
  notes: { type: String },
  completed: { type: Date, required: true },
  foreman: { type: ObjectId, ref: 'Foreman' },
  completedTasks: [{ type: ObjectId, ref: 'Task'}]
}, {
  timestamps: true
});

const TaskDayModel = mongoose.model('TaskDay', TaskDaySchema);

export { TaskDaySchema as Schema };
export default TaskDayModel;
