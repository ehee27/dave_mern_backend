const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DATABASE_URI)
    console.log('NOW connected to MongoDB')
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URI)
//   } catch (err) {
//     console.log(err)
//   }
// }
