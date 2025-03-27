import express from 'express';
import { addTask, getAllTask } from '../Controller/TaskController.js';
import { isUserLoggedin } from '../Utils/Auth.js';

const Router = express.Router();

Router.post("/add-task",addTask);
Router.get("/get-all-tasks",isUserLoggedin,getAllTask);

export default Router;