import { get } from 'mongoose';
import {ApiResponse} from '../utils/api-response.js';
import {asyncHandler} from '../utils/async-handler.js';

/**
 * Health Check Controller
 * 
 * 
const healthCheckController = async(req, res, next) => {
  try {
    const user= await getUSerFromDB();
    res.status(200)
    .json(new ApiResponse(200, {message :"Server is healthy and running"},));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, { error: 'Failed to perform health check' }));
  }
};
 */

const healthCheckController = asyncHandler(async (req, res, next) => {
  res.status(200)
    .json(new ApiResponse(200, { message: "Server is running" }));
});

export {healthCheckController};
