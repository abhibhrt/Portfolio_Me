import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDb Successfully');
}).catch((err) => {
    console.log('Error connecting to MongoDb', err);
});

export default mongoose;