var mysql = require('mysql')
var con

function connect(pass, db)
{
    con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: pass,
        database: db
    })
    con.connect(function(err)
    {
        if (err) throw err
        console.log("Conexion con base completada")
    });
}

function login(nombre, contraseña)
{
    var Sesion
    var sql = 'SELECT nom_usu, pass_usu, id_tus FROM usu WHERE nom_usu = ? AND pass_usu = ?';
    con.query(sql, [nombre, contraseña], (err, result, fields) =>
    {
        if (err) throw err
        var Sesion =
        {
            Nombre: result[0].nom_usu,
            Contraseña: result[0].pass_usu,
            Tipo: result[0].id_tus
        }
        console.log(Sesion)
        return Sesion
    })
}

exports.connect = connect
exports.login = login
