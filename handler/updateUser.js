const bcrypt = require('bcrypt');
const { User } = require('../models');
const Validator = require('fastest-validator');
const validation = new Validator();


module.exports = async (req, res) => {
  try {
    const schema = {
      name: 'string|empty:false',
      email: 'email|empty:false',
      password: 'string|min:8'
    }
  
    const validate = validation.validate(req.body, schema);
    
      if (validate.length) {
        return res.status(400).json({
          code: '400',
          status: 'error',
          message: validate
        });
      }
  
      const id = req.params.id;
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({
          code: '404',
          status: 'error',
          message: 'user not found'
        });
      }
  
      const email = req.body.email;
  
      if (email) {
        const checkEmail = await User.findOne({
          where: { email }
        }); 
  
      if (checkEmail && email !== user.email) {
        return res.status(409).json({
          code: '409',
          status: 'error',
          message: 'email already exist'
        });
      }
    }
  
    const password = await bcrypt.hash(req.body.password, 10);
    const { name } = req.body;
  
    await user.update({
      name,
      email,
      password,
    });
  
    return res.status(200).json({
      code: '200',
      status: 'success',
      data: {
        id: user.id,
        name,
        email,
      }
    });

  } catch (error) {
  return res.status(500).json({
      code: '500',
      status: 'error',
      message: 'internal server error'
    });
  }
}