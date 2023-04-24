const express=require('express');
const {ObjectId}=require('mongodb');
const db = require('../db');
const router=express.Router();


router.get('/customersignuplogin',(req,res)=>{
    res.render('customersignuplogin',{wrongPassword:'',alreadyexsists:''});
})

router.post('/customersignupdetails',(req,res)=>{
    const dbobj=db.getDb();
    

        dbobj.collection('customerlogindetails').findOne({email:req.body.myMail})
        .then(result=>{
            if(result){
                res.render('customersignuplogin',{wrongPassword:'',alreadyexsists:'Accout Already Exsists'});
            }else{
                dbobj.collection('customerlogindetails').insertOne({email:req.body.myMail,username:req.body.myName,password:req.body.myPassword})
                .then(result1=>{
                    
                    res.render('customersignuplogin',{wrongPassword:'',alreadyexsists:''});
                })
                .catch(erore1=>{
                    res.send(`Some Error Occured While inserting customer Details of user : ${erore1}`);
                })
            }
        })
        .catch(error2=>{
            res.send(`Some Error Occured While inserting Details of user : ${error2}`);
        })
        
});

router.post('/customerlogindetails',(req,res)=>{
    
    const dbobj=db.getDb();
        dbobj.collection('customerlogindetails').findOne({email:req.body.myMail})
        .then(result=>{
            if(result){
                if(result.password==req.body.myPassword){
                    
                    res.redirect('/customerinterface1');
                }else{
                    res.render('customersignuplogin',{wrongPassword:`Incorrect Credentials`,alreadyexsists:''});
                }
            }
            else{
                res.render('customersignuplogin',{wrongPassword:`Mail Doesn't Exsist`,alreadyexsists:''});
            }
        })
    
});

router.get('/customerinterface1',(req,res)=>{
    res.render('customerinterface1');
})

router.get('/customerproductdescription/:id',async (req,res)=>{
    const product_id=req.params.id;
    const dbobj=db.getDb();
    if(ObjectId.isValid(product_id)){
       await dbobj.collection('Product').findOne({_id:new ObjectId(product_id)})
        .then(product=>{
            if(product){
               let actualproducdata=product;
            let discount=actualproducdata.pdiscount;
            let budget=actualproducdata.pbudget;
            let Availability;
            if(actualproducdata.pavailability=1){
                Availability='Available';
            }else{
                Availability='Not Available';
            }
            let category =actualproducdata.catagory;
            let subcategory=actualproducdata.subcatagory;
            let location='all over india';
            let descrip=actualproducdata.pdescription;
            let reviews=[{name:'dean',rating:5,desc:'loved it!'},{name:'sam',rating:3,desc:'avg'},{name:'jack',rating:4.5,desc:'good'}]
            let count=21;
            let star=4;
    
        res.render('customerproductdescription',{count,star,discount,budget,Availability,category,subcategory,location,descrip,reviews});
            }
            else{
                console.log('ffwef');
                res.send('Some Error Occured while fetching data');
            }
        }).catch(eror=>{
            res.status(500).send('Some Error Occured while fetching the Data');
        });
    }else{
        res.status(500).send('Not a Valid Product');
    }


    let discount=10;
    let budget=500000;
    let Availability='Available';
    let category = 'event';
    let subcategory='wedding';
    let location='All over India';
    let descrip='A destination wedding takes place in a location away from a couples hometown. Planning a destination wedding could be less expensive than planning a traditional wedding if it entails a smaller guest list or smaller reception. Using credit card points or miles can help to save money on destination wedding travel costs.';
    

})

router.get('/ContactUs',(req,res)=>{
    res.render('ContactUs',{sucess:''});
})

//form submited by customer in contact us
router.post('/customercomplaint',(req,res)=>{
    const dbobj= db.getDb();

    dbobj.collection('complaints').insertOne(req.body)
    .then(result=>{
        res.render('ContactUs',{sucess:'QUERY INTIATED'});
    })
    .catch(erroe=>{
        res.render('ContactUs',{sucess:'SOMETHING WENT WRONG'});
    })
    
})


module.exports=router;