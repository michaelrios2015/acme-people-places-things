const { INTEGER, DATE } = require('sequelize');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:JerryPine@localhost/acme_people_places_db')

const People = conn.define('people', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }

});

const Place = conn.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }

});

const Thing = conn.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }

});

const Purchase = conn.define('purchase', {
    count: {
        type: INTEGER,
        //allowNull: false,
        //unique: true
    }
    ,
    date: {
        type: DATE
        //allowNull: false,
        //unique: true
    }
    
});

//this sticks a foriegn key into  Purchase
Purchase.belongsTo(People);
Purchase.belongsTo(Place);
Purchase.belongsTo(Thing);

//this does not change the tables but seems to be a way of joining (left outer join..because )the tables in sql
//I mean you should be able to do it without it but makes it easier
People.hasMany(Purchase);
Place.hasMany(Purchase);
Thing.hasMany(Purchase);

const syncAndSeed = async()=> {
    await conn.sync({ force: true});
    const [lucy, moe, larry] = await Promise.all(
        ['lucy', 'moe', 'larry'].map(name => People.create({name}))
    );
    const [NYC, Chicago, LA, Dallas] = await Promise.all(
        ['NYC', 'Chicago', 'LA', 'Dallas'].map(name => Place.create({name}))
    );
    const [foo, bar, bazz, quq] = await Promise.all(
        ['foo', 'bar', 'bazz', 'quq'].map(name => Thing.create({name}))
    );
    await Purchase.create({personId: 1, placeId: 3, thingId: 1, count: 3, date: "10-31-2020"});
    await Purchase.create({personId: 3, placeId: 2, thingId: 2, count: 3, date: "11-06-2019"});    
    await Purchase.create({personId: 2, placeId: 2, thingId: 3, count: 3, date: "03-15-2020"});    
}

module.exports = {
    syncAndSeed,
    //models just sequeilize way of saying table??
    models: { 
        People,
        Place,
        Thing,
        Purchase
    }
};