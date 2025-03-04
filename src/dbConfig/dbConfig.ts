const mongoose = require('mongoose');

const connect = async() => {
    try {
        mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log('Connected to MongoDB');
        })
        connection.on("error",(err : Error)=>{
            console.log('Error connecting to MongoDB',err);
            process.exit();
        })
    } catch (error) {
        console.log(error);
    }
}

export default connect;