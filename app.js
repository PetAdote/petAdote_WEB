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
app.get('/cadastro1', function(req,res){

	res.render('cadastro1')

})
app.get('/cadastro2', function(req,res){

	res.render('cadastro2')

})
app.get('/cadastro3', function(req,res){

	res.render('cadastro3')

})


app.listen(8081,function(){

	console.log ('executando na porta 8081')

})