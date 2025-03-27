import { catchAsyncError } from "../MiddleWare/CatchAsyncError.js";
import TaskModel from "../Model/TaskModel.js";
import Errorhandler from "../Utils/ErrorHandler.js";

export const addTask = catchAsyncError(async (req, res, next) => {
  const { title, link } = req.body;

  if (!title || !link) {
    return next(new Errorhandler("Title and link are required.", 400));
  }

  const task = new TaskModel({ title, link });
  await task.save();

  res.status(201).json({ success: true, message: "Task added successfully!", task });
});

export const getAllTask = catchAsyncError(async (req, res, next) => {
    const tasks = await TaskModel.find();

    if (!tasks || tasks.length === 0) {
        return next(new Errorhandler("No tasks found", 404));
    }
    const randomTasks = tasks
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 5); 

    res.status(200).json({ success: true, tasks: randomTasks });
});
