import mongoose from "mongoose";

const dbConnect = async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`Connected to db `,conn.connection.host);
    } catch (error) {
        console.log("Some error ",error);
        process.exit(1);
    }
}

export default dbConnect;