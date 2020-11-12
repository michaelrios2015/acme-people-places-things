const { syncAndSeed } = require('./db');

const init = async() => {
    try {
    await syncAndSeed()
    console.log('ready');
    }
    catch(ex){
        console.log(ex);
    }
};

init();