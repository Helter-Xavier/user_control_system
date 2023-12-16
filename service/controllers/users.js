const express = require('express');
const router = express.Router();
const db = require('./../db/models')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authToken = require('../middleware/authToken')
var cors = require('cors');
const isAdmin = require('../middleware/isAdmin');
const {eAdmin} = require('../middleware/authToken');
//Configuração CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header('Access-Control-Allow-Headers', "X-PINGOTHER ,Content-Type, Authorization");
    // router.use(cors())
    next();
});

//Express JSON
router.use(express.json());

//Rota principal
router.get("/", eAdmin, isAdmin, async (req, res) => {
   try {
    const users = await db.Users.findAll({
      attributes: ['id', 'name', 'email', 'status'],
      order: [['id', 'ASC']]
    });

    if (users.length > 0) {
      return res.json({ users, id_usuario_logado: req.userId });
    } else {
      return res.status(400).json({ mensagem: "Erro: Nenhum usuário encontrado!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.post("/cadastro-completo", async (req, res) => {
    const t = await db.sequelize.transaction(); // Inicia uma transação

    try {
        const userData = req.body;
        userData.password_hash = await bcrypt.hash(userData.password_hash, 6);

        const createUser = await db.Users.create(userData, { transaction: t });

        // Verificar se de que role_name está presente nos dados recebidos
        if (!userData.role_name) {
            await t.rollback(); // Reverte a transação em caso de erro
            return res.status(400).json({
                mensagem: 'Erro: role_name não fornecido!',
            });
        }

        // Verifique se a role já existe
        const existingRole = await db.Roles.findOne({
            where: { role_name: userData.role_name }
        });

        if (!existingRole) {
            await t.rollback(); // Reverte a transação em caso de erro
            return res.status(400).json({
                mensagem: 'Erro: Role não encontrada!',
            });
        }
        
        // Associação do usuário ao role usando Users_Roles
        await db.Users_roles.create({
            user_id: createUser.id,
            role_id: existingRole.id,
        }, { transaction: t });

        // Confirma a transação, se todas as operações acima forem bem-sucedidas
        await t.commit();

        return res.json({
            success: true,
            message: 'Usuário cadastrado com sucesso!',
            userData
        });

    } catch (error) {
        console.error(error);
        // Reverte a transação em caso de erro
        await t.rollback();

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                mensagem: 'Erro: Este e-mail já foi cadastrado!',
            });
        }

        return res.status(400).json({
            mensagem: 'Erro: Usuário não cadastrado!',
        });
    }
});

router.put("/editar-usuario/:id", eAdmin, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Obtenha os dados atualizados do usuário
        const updatedUserData = req.body;

        // Criptografe a nova senha, se fornecida
        if (updatedUserData.password_hash) {
            updatedUserData.password_hash = await bcrypt.hash(updatedUserData.password_hash, 6);
        }

        // Verificarse role_name está presente nos dados recebidos
        if (!updatedUserData.role_name) {
            return res.status(400).json({
                mensagem: 'Erro: Função não fornecido!',
            });
        }
        // Verifica se a Role já existe
        const existingRole = await db.Roles.findOne({
            where: { role_name: updatedUserData.role_name }
        });

        if (!existingRole) {
            return res.status(400).json({
                mensagem: 'Erro: Função não encontrada!',
            });
        }

        // Atualizar os dados do usuário
        await db.Users.update(updatedUserData, {
            where: { id }
        });

        // Atualize a associação do usuário com a função
        await db.Users_roles.update(
            { role_id: existingRole.id },
            { where: { user_id: id } }
        );

        return res.json({
            mensagem: "Usuário editado com sucesso!"
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            mensagem: "Erro ao editar usuário"
        });
    }
});

router.delete("/deletar-usuario/:id", async (req, res) => {
    //receber ID
    const {
        id
    } = req.params;
    //Delete de usuario
    await db.Users.destroy({
            where: {
                id
            }
        })
        .then(() => {
            return res.json({
                message: "Usuário deletato!"
            })
        }).catch(() => {
            return res.status(400).json({
                message: "Erro: Falha ao deletar usuario"
            })
        })
});

router.get("/lista-de-usuarios", eAdmin, async (req, res) => {
  try {
    const users = await db.Users.findAll({
      attributes: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
      order: [['id', 'ASC']],
      include: [
        {
          model: db.Roles,
          attributes: ['role_name'],
          through: { attributes: [] } 
        },
      ]
    });

    if (users.length > 0) {
      return res.json({ users });
    } else {
      return res.status(400).json({ mensagem: "Erro: Nenhum usuário encontrado!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.post("/create-role", async (req, res) => {
    try {
        const { role_name } = req.body;

        // Verifica role_name está presente nos dados recebidos
        if (!role_name) {
            return res.status(400).json({
                mensagem: 'Erro: role_name não fornecido!',
            });
        }

        // Verifique se a função já existe
        const existingRole = await db.Roles.findOne({
            where: { role_name }
        });

        // Se a função não existe, crie-a
        if (!existingRole) {
            await db.Roles.create({ role_name });
            return res.json({
                mensagem: "Função criada com sucesso!"
            });
        } else {
            return res.status(400).json({
                mensagem: 'Erro: Role já existente!',
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            mensagem: "Erro ao criar função"
        });
    }
});

router.get("/list-roles", eAdmin, isAdmin, async (req, res) => {
    try {
        const listRoles = await db.Roles.findAll({
        attributes: ['role_name'],
        order: [['id', 'ASC']],
        });

    if (listRoles.length > 0) {
      return res.json({ listRoles })
    } else {
        return res.status(400).json({ mensagem: "Erro: Nenhuma função encontrada!" });
    }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
});

router.delete("/delete-roles/:id", eAdmin, isAdmin, async (req, res) => {
    //receber ID
    const {
        id
    } = req.params;
    //Delete de usuario
    await db.Roles.destroy({
            where: {
                id
            }
        })
        .then(() => {
            return res.json({
                message: "Função deletata!"
            })
        }).catch(() => {
            return res.status(400).json({
                message: "Erro: Falha ao deletar usuario"
            })
        })
});

router.get("/visualizar-usuario/:id", eAdmin, isAdmin, async (req, res) => {
    //receber ID
    const {
        id
    } = req.params

    // var dados = req.body;
    // dados.password = 
    //Encontra o usuário selecionado pelo paramentro ID
   const user = await db.Users.findOne({
      attributes: ['id', 'name', 'email', 'status'],
       where: {
            id
        },
      include: [
        {
          model: db.Roles,
          attributes: ['role_name'],
          through: { attributes: [] } 
        },
        
      ]
    });
    //Se existir usuário ID retorna seus valores
    if (user) {
        return res.json({
            user: user.dataValues
        })
        //Se não exister retorna ERRO 400
    } else {
        return res.status(400).json({
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    }
});

router.post("/login", async (req, res) => {
    //Seleciona m unico usuario
    const user = await db.Users.findOne({
        attributes: ['id', 'name', 'email', 'status', 'password_hash'],
        where: {
            email: req.body.email
        },
        include: [
        {
          model: db.Roles,
          attributes: ['role_name'],
          through: { attributes: [] } 
        },
      ]
    });

    //Se não for corretos Senha ou Usuário retorna ERRO 400 
    if (user === null) {
        return res.status(400).json({
            mensagem: "Erro: Esse usuário não existe!"
        });
    }
    //Compara senha digitada pelo usuário com a senha do banco de daods
    //Se forem diferente retorna ERRO 400
    if (!(await bcrypt.compare(req.body.password_hash, user.password_hash))) {
        return res.status(400).json({
            mensagem: "Erro: Usuário ou senha incorreta!"
        });
    }
    //TOKEN para login autenticado
    //TOKEN expira em 1 DIA
    var token = jwt.sign({
        id: user.id
    }, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        expiresIn: '1d'
    });
    //Quando dados do usarios estiverem corretos
    //Login realizado com sucesso
    //Retorna dados do usuario no sistema
    console.log(token)

    return res.json({
        erro: false,
        message: "Login realizado com sucesso",
        user: user.dataValues,
        token: token
    });
})

// Exemplo de rota acessível apenas por administradores
router.get("/rota-protegida-admin", eAdmin, isAdmin, async (req, res) => {
  try {
    //O usuário passou pelos middlewares e foi altorizado pq é um administrador
    return res.json({
      mensagem: "Você é um Administrador, você tem acesso a esta página",
      dadosUsuario: req.user, 
    });
  } catch (error) {
    console.error(error);
    // Se ocorrer um erro, retorne uma resposta de erro 500
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
});

module.exports = router;