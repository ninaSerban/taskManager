require('../src/db/mongoose')
const Task = require('../src/models/task');

Task.findByIdAndRemove('619397fd12f946d52f9d3046').then((task) => {
    console.log(task);
    return Task.countDocuments({completed: false})
}).then((result) => {
console.log(result);
}).catch((e) => {
console.log(e);
})

const findAndRemove = async(id, completed) => {
    const findTaskAndRemove = await Task.findByIdAndRemove(id);
    const countTasks = await Task.countDocuments({completed})
    return countTasks;
}

findAndRemove("6194a1d989b94232748419a2", true ).then((count) => {
console.log(count);    
}).catch((e) => {
    console.log(e);
})

