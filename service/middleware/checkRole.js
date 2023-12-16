const db = require('../db/models');
const authToken = require('../middleware/authToken')

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Certifica-se de que req.userId está definido
      console.log('req.userId:', req.userId);
    //   if (!req.userId) {
    //     return res.status(403).json({
    //       erro: true,
    //       message: 'Sem permissão para acessar esta rota',
    //     });
    //   }

      // Obtém o usuário do banco de dados ou da autenticação
      const user = await db.Users.findOne({
        where: { id: req.userId },
        include: [
          {
            model: db.Roles,
            attributes: ['role_name'],
            through: { attributes: [] },
          },
        ],
      });

      // Verifica se o usuário tem a função necessária
      const userRoles = user.Roles.map((role) => role.role_name);
      const hasRequiredRole = userRoles.includes(requiredRole);

      if (hasRequiredRole) {
        next(); // Continua para a próxima rota se tiver a função necessária
      } else {
        return res.status(403).json({
          erro: true,
          message: 'Sem permissão para acessar esta rota',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: true,
        message: 'Erro interno do servidor',
      });
    }
  };
};


module.exports = checkRole;
