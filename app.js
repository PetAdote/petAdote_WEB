const express = require('express');

const app = express();

const path = require('path')

app.set('views','./views')

app.set("view engine", "ejs");

app.use(express.static(__dirname+ '/public'));

app.get('/',(req, res) => {
	var usuario = {
		"nome": "Gustavo",
		"idade": 16,
		"sexo": "Masculino"
	}
	res.render("home",{'user': usuario})

})
app.get('/login',function(req,res){

	res.render("login")

})

app.listen(8081,function(){

	console.log ('executando na porta 8081')

})