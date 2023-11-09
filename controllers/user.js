const userdetailstable =require('../model/userdetails')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

function genrateAcesstoken(id, ispremiumuser){
  return jwt.sign({ userid: id, ispremiumuser: ispremiumuser },"98789d8cedf2f9a86af5391e930337cfe11ffc64ef0140fa8989920e2034a307494d74fe50bd5c7e3f137e56c7da3999309264ae5c29b54937c72f6c27563f28")
}


const signupdetails =  async (req, res, next) => {
      try {
          const Name = req.body.name;
          const email = req.body.email;
          const password = req.body.password;

          const saltRounds = 10; // You can adjust the number of salt rounds
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const existingUser = await userdetailstable.findOne({ where: { Email: email } });
          console.log(existingUser);
          if (existingUser == null) {
              const userinfo = await userdetailstable.create({ Name: Name, Email: email, password: hashedPassword });
              return res.json({ success: true, message: 'Account created successfully' });
          }
          else{
              return res.json({ success: false, message: 'Account created successfully' });
          }


      } 
      catch (e) {
          console.log(e);
          return res.status(500).json({ success: false, message: 'An error occurred' });
      }
};




const logindetails = async (req, res) => {
  const { email, password } = req.body;
  try {
      // Find the user by email
      const user = await userdetailstable.findOne({ where: { Email: email } });

      if (user) {
          // Compare the provided password with the hashed password in the database
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
              // Passwords match, login successful
              console.log(user.ispremiumuser)
              const token = genrateAcesstoken(user.id,user.ispremiumuser);
              console.log(user.id)
              return res.json({ success: true, message: 'Login successful', token: token });
          } else {
              // Password doesn't match, return an error message
              return res.json({ success: false, message: 'Incorrect password' });
          }
      } else {
          // User not found with the provided email, return an error message
          return res.json({ success: false, message: 'User not found' });
      }
  }

  catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


module.exports={
  
  signupdetails,
  logindetails,
  
}
