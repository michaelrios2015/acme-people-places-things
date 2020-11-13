const { syncAndSeed, models: { People, Place, Thing, Purchase } } = require('./db');
const express = require('express');
const app = express();

//app.use(require('method-override')('_method'));
//seems to be some sort of magic formula to return form items?? essentially it helps
//me get user input but not entirely sure how MIDDLEWARE to get form values
app.use(express.urlencoded({extended:false}));

//not sure what this does does not seem to be needed
app.use(express.json());

app.get('/', async(req, res, next)=> {
    try {
        const [people, places, things, purchases] = await Promise.all([
           People.findAll({
            include: [ Purchase]
           }),
           Place.findAll(),
           Thing.findAll(),
           //seems to be acting as a join
           Purchase.findAll({
               include: [ People, Place, Thing]
           })
        ])
        res.send(`
        <html>
            <head>
                <title>Acme People Places Things</title>
            </head>
            <body>
                <div>

                <form method='POST'>

                <h2>People</h2>
                    <select name='personId'>
                        ${ people.map( person => `
                            <option value ='${person.id}'> ${ person.name} </option>
                        `).join(' ')}
                    </select>
                    
                <h2>Places</h2>
                    <select name='placeId'>
                        ${ places.map( place => `
                            <option value ='${place.id}'> ${ place.name} </option>
                        `).join(' ')}
                    </select>
                    
                <h2>Things</h2>
                    <select name='thingId'>
                        ${ things.map( thing => `
                            <option value ='${thing.id}'> ${ thing.name} </option>
                        `).join(' ')}
                    </select>




                <button>Save</button>
                </form>
                    
              
                    

                    <h2>Purchases</h2>
                    <ul>
                        ${ purchases.map( purchase => `
                            <li>
                                ${ purchase.id}: ${purchase.person.name},  ${purchase.place.name}, ${purchase.thing.name}, ${purchase.count}  
                            </li>
                        `).join(' ')}
                    </ul>
                </div>
            </body>
        </html>
        `);
    }
catch(ex){
    next(ex);
}

});


app.post('/', async(req,res,next)=>{
    try {
        console.log('--------------------posted---------------------')
        console.log(req.body);
        console.log(req.body.personId);
        //const purchase = await Purchase.create({personId: req.body.personId, placeId: req.body.placeId, thingId: req.body.thingId, count: 3});
        const purchase = await Purchase.create(req.body);
        res.redirect('/');
    }
    catch(ex){
      next(ex);
    }
  
  });

const init = async() => {
    try {
    await syncAndSeed()
    const port = process.env.PORT || 3000;
    app.listen(port, ()=>console.log(`listening on port ${port}`));
    console.log('ready');
    }
    catch(ex){
        console.log(ex);
    }
};

init();