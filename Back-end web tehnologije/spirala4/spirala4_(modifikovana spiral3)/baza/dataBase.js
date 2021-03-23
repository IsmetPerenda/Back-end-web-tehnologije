const Sequelize = require("sequelize");

const sequelize = new Sequelize('bwt2062st', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

})

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

//modeli
database.predmet = require(__dirname +"/modeli/predmet.js")(sequelize, Sequelize.DataTypes);

database.aktivnost = require(__dirname + "/modeli/aktivnost.js")(sequelize, Sequelize.DataTypes);

database.grupa = require(__dirname + "/modeli/grupa.js")(sequelize, Sequelize.DataTypes);

database.dan = require(__dirname + "/modeli/dan.js")(sequelize, Sequelize.DataTypes);

database.tip = require(__dirname + "/modeli/tip.js")(sequelize, Sequelize.DataTypes);

database.student = require(__dirname + "/modeli/student.js")(sequelize, Sequelize.DataTypes);


//relacije


// jedan na više Predmet 1-N Grupa
database.predmet.hasMany(database.grupa, {
  as: "grupa-predmet",
  foreignKey: "predmetFK"
});


// više na jedan Aktivnost N-1 Predmet
database.predmet.hasMany(database.aktivnost, { 
  as: "aktivnost-predmet", 
  foreignKey: "predmetFK" 
});



//više na nula Aktivnost N-0 Grupa
database.grupa.hasMany(database.aktivnost, { 
  as: "aktivnost-grupa", 
  foreignKey: "grupaFK" 
});

//više na jedan Aktivnost N-1 Dan
database.dan.hasMany(database.aktivnost, { 
  as: "aktivnost-dan", 
  foreignKey: "danFK" 
});

//više na jedan Aktivnost N-1 Tip
database.tip.hasMany(database.aktivnost, { 
  as: "aktivnost-tip", 
  foreignKey: "tipFK" 
});



// više na više Student N-M Grupa
database.studentGrupa=database.student.belongsToMany(database.grupa,{as:'grupa',through:'student_grupa',foreignKey:'studentFK'});
database.grupa.belongsToMany(database.student,{as:'student',through:'student_grupa',foreignKey:'grupaFK'});


module.exports = database;