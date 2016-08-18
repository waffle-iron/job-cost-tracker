import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ForemanSchema = new Schema({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true,
  toObject: {
     virtuals: true
  },
  toJSON: {
     virtuals: false
  }
});

ForemanSchema.virtual('names').get(function() {
  let names = this.name || '';
  let [first, ...middle] = this.name.split(' ');
  let last = middle.pop();
  return {
    first,
    middle,
    last
  };
});

ForemanSchema.virtual('names').set(function(names) {
  this.name = [names.first, ...names.middle, names.last].join('');
});

export default mongoose.model('Foreman', ForemanSchema);
