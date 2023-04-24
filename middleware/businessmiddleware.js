const jwt=require('jsonwebtoken');
const db = require('../db');
const {ObjectId}=require('mongodb');

const requireBusinessAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    
    if(token){
        jwt.verify(token,'a secret message',(error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.redirect('/businesssignuplogin');
            }else{
                // console.log(decodedtoken);
                next();
            }

        })
            
        
    }else{
        res.redirect('/businesssignuplogin');
    }
}

const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'a secret message',(error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.locals.user='';
                next();
            }else{
                
                const dbid= db.getDb();

                dbid.collection('business').findOne({_id: new ObjectId(decodedtoken.id)})
                .then(reslut=>{
                    if(reslut){
                        res.locals.user=reslut.username;
                    next();
                    }
                    else{
                        res.locals.user='';
                        next();
                    }
                    
                })
            }

        })
    }else{
        res.locals.user='';
        next();
    }
}

module.exports={requireBusinessAuth,checkUser};