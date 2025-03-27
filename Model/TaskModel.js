import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
