// Importações.
	const express = require('express');
	const app = express();

	const path = require('path');

// Configurações.

	// View Engine.
		// app.set('views','./views');	// Não é necessário, a EJS entende o diretório "views" na raiz da aplicação como padrão para Views.
		app.set("view engine", "ejs");

	// Arquivos Estáticos(Públicos) --- Cuidado, todo contéudo dentro desse diretório pode ser fácilmente acessado pelos usuários finais de forma irrestrita.
		app.use('/public', express.static(path.join(__dirname, "public")));	
			// Tente dar um [ Console.log(path.join(__dirname, "public")); ] em uma Middleware qlqr e atualize a página no navegador com a aplicação rodando.
			// Veja o resultado no console. (Deverá ser o caminho absoluto para a pasta "public")


// Gerenciamento das Rotas.
	app.get('/',(req, res) => {
		var usuario = {
			"nome": "Gustavo",
			"idade": 16,
			"sexo": "Masculino"
		}
		res.render("home",{'user': usuario})
	});

	app.get('/login',function(req,res){
		res.render("login")
	});

// Execução dos Request Listeners do servidor HTTP. Faz o servidor rodar :D
app.listen(8081,function(){
	console.log('Servidor HTTP inicializado no endereço: "https://localhost:8081"');
});


/**
 Observações: 	Incluí o módulo do nodemon como dependência de desenvolvimento (npm install --save-dev nodemon) - Veja o "package.json".
				Além disso, incluí um script para executar o servidor de forma mais ágil com o próprio nodemon.
				Inicie o servidor usando este comando no terminal:	"npm run dev" --- "npm run" executa os "scripts" configurados no "package.json".

				Também ajustei algumas pequenas coisas na View "login.ejs". Dá uma olhada lá.
				Boa sorte manin! Alguns pequenos ajustes são necessários, mas você tá aprendendo muito rápido a aplicar os conceitos dessa tecnologia, parabéns e obrigado! \o
 */