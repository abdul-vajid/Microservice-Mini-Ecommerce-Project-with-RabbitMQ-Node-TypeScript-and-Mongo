import mongoose from "mongoose"

export default () =>{
    const uri: any = process.env.MONGO_URI

    mongoose.set("strictQuery", false);

    mongoose.connect(uri).then((connection)=> {
        console.log("Database connected successfully")
    }).catch((error)=> {
        console.log(`Database connection failed : ${error}`);

    })
}

