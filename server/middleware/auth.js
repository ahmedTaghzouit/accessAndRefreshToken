import jwt  from "jsonwebtoken";
export const Auth = async(req, res, next)=>{
    try {
        
        const token = req.get('authorization');
        if(!token) return res.status(401).send('there is no token')
        const JWT_SCRET = req.originalUrl.includes('refreshToken')  ? process.env.JWT_SCRET_REFRESH : process.env.JWT_SCRET;
        jwt.verify(token.split(' ')[1],JWT_SCRET,(err,user)=>{

            if (err) {
                if (err.name === 'TokenExpiredError') {
                  return res.status(403).send('Token Expired');
                } else {
                  return res.status(401).send('Invalid Token');
                }
              }
            req.user = user;
            next();

        })
        
    } 
    catch (err) {
        console.log(err)
    }
    

}
