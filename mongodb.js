//      /Users/z004f2xj/mongodb/bin/mongod.exe --dbpath=/Users/z004f2xj/mongodb-data

const {MongoClient, ObjectId } = require('mongodb') //mongoClient gives access to necessary function to connect to db

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

const id = new ObjectId();
// console.log(id.id.length)
// console.log(id.toHexString().length)

MongoClient.connect(connectionURL, { useNewUrlParser:true }, (error, client) => {
    if(error){
        return console.log("Unable to conect to db")
    } 
    const db = client.db(dbName) // connect to a specific database 

    // CREATE
    db.collection('Users').insertOne({
        name: "Vikram",
        age: 27
    }, (error, result) => {
        if(error){
            return console.log("Unable to insert user")
        }
        console.log(result)
    })

    db.collection('Users').insertMany([
        {
            name:'Jen',
            age:27
        },
        {
            name:'Gunther',
            age:60
        }
    ], (error, result) => {
        if(error){
            return console.log("Unable to insert users")
        }
        console.log(result)
    })

    // // READ
    db.collection('Users').findOne({ _id: new ObjectId('619355235698b06445379fba' )},(error, user) => {
        if(error){
            return console.log("Unable to fetch the user")
        }
        console.log(user)
    }) 

    db.collection("Users").find({ age: 27 }).toArray((eror, users) => {
        console.log(users)
    })
    db.collection("Users").find({ age: 27 }).count((eror, count) => {
        console.log(count)
    })

    // // UPDATE
   db.collection("Users").updateOne({
        _id: new ObjectId('61936d2f3030aff175ccf883')
    }, {
        //$set, $unset(remove a field), etc)
        $set: {
            name:"Nina"
        },
        $inc: ({
            age: 1
        })
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error);
    })

    // // DELETE
    db.collection("Users").deleteMany({
        age:27
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })













    // // Challenges
    // // CREATE
    // db.collection('Tasks').insertMany([
    //     {
    //         description:"Groceries",
    //         completed: true
    //     },{
    //         description:"Laundry",
    //         completed: false
    //     },{
    //         description:"Errands",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert tasks")
    //     }
    //     console.log(result);
    // })

    // // READ
    // db.collection("Tasks").findOne({_id : new ObjectId("619351d3cd5e775f40ddc2f9")}, (error, task) => {
    //     if(error){
    //         return console.log("Unable to fetch the task with _id: 619351d3cd5e775f40ddc2f9 ")
    //     }
    //     console.log(task)
    // });

    // db.collection("Tasks").find({completed: false}).toArray((error, tasks) => {
    //     if(error){
    //         return console.log("Unable to fetch the list of uncompleted tasks")
    //     }
    //     console.log(tasks)
    // })

    // // UPDATE
        // db.collection("Tasks").updateMany({
    //     completed:false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // //DELETE
    // db.collection("Tasks").deleteOne({
    //     description:"Groceries"
    // }).then((result) => { 
    //     console.log(result) 
    // }).catch((error) => {
    //     console.log(error);
    // })
})
