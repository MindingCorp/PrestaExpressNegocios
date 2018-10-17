const createError = require('http-errors');
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const path = require('path');
var app      = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
server.listen(80);
var indexRouter = require('./routes/index');
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

require('./config/passport')(passport);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Para el passport
app.use(session({
	secret: 'keysecreta',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas

require('./routes/index.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//Esta es parte del chat (WebSockets)
var usuariosConectados = {};
io.sockets.on('connection',function(socket){
			socket.on('enviarNombre',function(datos){
					if(usuariosConectados[datos[0]])
							socket.emit('errorName')
					else
					{
							socket.nickname = datos[0];
							usuariosConectados[datos[0]] = socket.nickname;
					}
					data = [datos[0],data[1],usuariosConectados];
					io.socket.emit('mensaje,data');
			});
			socket.on('enviarMensaje',function(mensaje){
					var data[socket.nickname, mensaje];
					io.sockets.emit('newMessage',data);
			});
			sockets.on('disconnect',function(){
					delete usuariosConectados[socket.nickname];
					data = [usuariosConectados,socket.nickname];
					io.sockets.emit('usuariosConectados',data);
			});
});

module.exports = app;
