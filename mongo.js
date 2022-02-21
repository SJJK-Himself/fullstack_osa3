const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sjjk:${password}@cluster0.8dsqy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

if(process.argv.length === 5){
    person.save().then(result => {
    console.log('Added', person.name, person.number, 'to phonebook')
    mongoose.connection.close()
    })
}

if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

else{
    console.log("ERROR: Check your parameters!")
}