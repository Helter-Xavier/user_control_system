const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
  eAdmin: async function (req, res, next) {
    // Autorização de acesso do usuário
    const authHeaders = req.headers.authorization;
    console.log(authHeaders)
    // Se não houver autorização de acesso: ERRO 400 e retorna a mensagem de erro
    if (!authHeaders) {
      return res.status(400).json({
        erro: true,
        message: 'Erro: Necessário realizar o login para acessar a página!',
      });
    }

    // const [bearer, token ] = authHeaders.split(' ');
    // console.log("bearer: " + bearer + " Token: " + token)
    
    try {
      const token = authHeaders.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          erro: true,
          message: 'Erro: Necessário realizar o login para acessar a página!',
        });
      }

      // Decodificar o token e extrair informações
      const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
      console.log(decode);
      // Definir o ID do usuário na requisição
      req.userId = decode.id;
      next();
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        erro: true,
        message: 'Erro: Token inválido ou expirado. Necessário realizar o login para acessar a página! A',
      });
    }
  },
};
