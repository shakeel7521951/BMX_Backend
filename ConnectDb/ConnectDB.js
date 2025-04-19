import mongoose from 'mongoose';

const connectdb = () => {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Database connected');
  });
};

export default connectdb;
