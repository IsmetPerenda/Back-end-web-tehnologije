const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Student = sequelize.define("Student",{
        ime:Seq.STRING,
        index:Seq.STRING

    });
return Student;
}