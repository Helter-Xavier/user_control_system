const db = require('../db/models');

const isAdmin = async (req, res, next) => {
  try {
    // Obtenha o ID do usuário a partir do token
    const userId = req.userId;
    console.log(userId)
    //Pegando role_name
    const adminRole = await db.Roles.findOne({
      where: {
        role_name: 'Administrador',
      },
    });

     if (!adminRole) {
      // Se a role de administrador não existir, retorne um erro
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro interno do servidor. A função de administrador não foi encontrada.',
      });
    }
    
    // Verificar se o usuário tem a função de administrador
    const isAdmin = await db.Users_roles.findOne({
      where: {
        user_id: userId,
        role_id: adminRole.id,
      },
    });

    if (isAdmin) {
      next();
    } else {
      // Se o usuário não for um administrador, retorne um erro
      return res.status(403).json({
        erro: true,
        mensagem: 'Acesso negado. Você não tem permissão para essa funcionalidade.',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro interno do servidor.',
    });
  }
};

module.exports = isAdmin;
