import mongoose from 'mongoose';

const connectdb = () => {
  mongoose.connect("mongodb://localhost:27017/BMX_Adventure").then(() => {
    console.log('Database connected');
  });
};

export default connectdb;
