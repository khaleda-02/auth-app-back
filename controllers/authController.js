//des    login
//route  GET /auth/login
//author khaled
const login = async (req, res) => {
  const {email , pass} = req.body ;
  
  console.log(req.body)
  res.json(req.body).status(200)
}

module.exports = { login }