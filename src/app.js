const readline = require('readline');

const {validateUserInput} = require('./inputOutput');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function app(){
    rl.question('> ', (input) =>{
        let splitInput = input.split(" ");
        console.log(validateUserInput(splitInput));
        rl.close();
    });
}

module.exports = {
    app
};