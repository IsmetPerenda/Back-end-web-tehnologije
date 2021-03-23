const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Tip = sequelize.define("Tip",{
        naziv:Seq.STRING
    });
return Tip;
}