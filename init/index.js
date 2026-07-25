const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("../models/listing.js");


let mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
main() .then((res)=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(mongo_url);


}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:("6a5c9c7d32a8baeda7f2899e")}))
    await Listing.insertMany(initData.data);
    console.log("data was initilayze");

}

initDB();