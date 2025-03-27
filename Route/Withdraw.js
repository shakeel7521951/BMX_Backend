import express from 'express';
import { isUserLoggedin } from '../Utils/Auth.js';
import { getAllWithdrawRequests, updateWithdrawStatus, withdrawRequest } from '../Controller/WithdrawController.js';
const Router = express.Router();

Router.post('/withdraw-request',isUserLoggedin,withdrawRequest);
Router.get('/get-all-requests',isUserLoggedin,getAllWithdrawRequests);
Router.put('/update-withdraw-status/:withdrawId',isUserLoggedin,updateWithdrawStatus);

export default Router;