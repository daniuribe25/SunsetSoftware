var express  = require("express"),
app      = express(),
http     = require("http"),
bodyParser  = require("body-parser"),
methodOverride = require("method-override");
server   = http.createServer(app);
var router = express.Router();
var nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT','POST','GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     // intercept OPTIONS method
     if ('OPTIONS' == req.method) {
        res.send(200);
      }
      else {
        next();
      }
 });
 
app.use(express.static(__dirname + '/public'));
var server_port = process.env.PORT || 5000;

router.route('/').get(function(req,res){
    res.sendFile(__dirname + '/public/index.html')
});

router.route('/sendMail').post(function(req,res){
    var body = {
               name: req.body.name,
               cel: req.body.cel,
               subject: req.body.subject,
               message: req.body.message,
               email: req.body.email,
               pais: req.body.pais
            };
    sendUserEmail(body)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    res.json("OK");
});

app.use("/api",router);


function sendUserEmail(form) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
            user: 'dani.uribe25@gmail.com', // Your email id
            pass: 'iamthebest123' // Your password
        }
    });
    var htmlContent = "<div>"+
                        "<h2>Nuevo Mensaje</h2>"+
                        "<span style='font-weight: 600'>  Nombre:</span>  "+form.name+" <br /><br />"+
                        "<span style='font-weight: 600'>   Celular:</span> "+form.cel+"<br /><br />"+
                        "<span style='font-weight: 600'>   Correo:</span> "+form.email+"<br /><br />"+
                        "<span style='font-weight: 600'>   Pais:</span> "+form.pais+"<br /><br />"+
                        "<span style='font-weight: 600'>   Tema:</span> "+form.subject+"<br /><br />"+
                        "<span style='font-weight: 600'>   Mensaje:</span>  "+form.message+"<br /><br />"+
                    "</div>";
    var mailOptions = {
        from: 'dani.uribe25@gmail.com', // sender address
        to: 'dani.uribe25@gmail.com', // list of receivers
        // to: 'dani.uribe25@gmail.com',
        subject: 'Nuevo contacto de '+ form.name, // Subject line
        text:  '',//, // plaintext body
        html: htmlContent
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return {
                state:"error",
                message:error
            };
        } else {
            return {
                state:"ok",
                message:info.response
            };
        };
    });
}

app.listen(server_port, function() {
    console.log("Node server running on port "+ server_port);
    });