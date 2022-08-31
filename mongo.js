const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

const connection = () => {
  mongoose.connect(connectionString)
    .then(() => {
      console.log('Database connected')
    }).catch(err => {
      console.error(err)
    })

  process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
  })
}

module.exports = connection
// const note = new Note({
//   title: 'Example uwu',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then(response => {
//     console.log(response)
//     mongoose.connection.close()
//   }).catch(err => {
//     console.log(err)
//   })
