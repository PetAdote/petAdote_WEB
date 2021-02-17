const express = require('express');
const app = express();
app.set("view engine", "ejs");

app.get('/',(req, res) => {
	var usuario = {
		"nome": "Gustavo",
		"idade": 16,
		"sexo": "Masculino"
	}
	res.render("home",{'user': usuario})

})

app.listen(8081,function(){

	console.log ('executando na porta 8081')

})