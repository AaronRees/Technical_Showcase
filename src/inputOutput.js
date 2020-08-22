const { getJSON } = require('./requestJSON');

function logData(jsonData){
    if(jsonData !== undefined){
        //accessing an array
        for(let item of jsonData){
            console.log(`[${item.id}] ${item.title}`);
        }
    } 
}

function validateUserInput(userInput){
    let input = userInput.filter((userIn) => /\S/.test(userIn));
    let [cmd, num, ...etc] = input;
    if(cmd !== 'photo-album' ||
       num === undefined ||
       isNaN(num) ||
       etc.length !== 0
    ){
        return 'Usage: photo-album <album category to select>';
    }
    else if(parseInt(num) > 100){
        return 'Number is greater than number of albums';
    }
    else if(parseInt(num) < 1){
        return 'Invalid album number';
    }
    else{
        getJSON(logData, num);
        return "";
    }
}

module.exports = {
    validateUserInput,
    logData
}