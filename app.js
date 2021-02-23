const express = require('express');

const app = express();

const path = require('path')

app.set("view engine", "ejs");

app.use('/public', express.static(path.join(__dirname, "public")));

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
app.get('/cadastro', function(req,res){

	res.render('cadastro')

})

app.listen(8081,function(){

	console.log ('executando na porta 8081')

})