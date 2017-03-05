var bodyParser=require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports=function(app,connection){
    app.get('/',function(req,res){
        
        connection.query("select * from item",function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
        });
        
        res.render('dashboard');
    });

    // dashboard page
    app.get('/dashboard',function(req,res){
        res.render('dashboard');
    });

    // add item page
    app.get('/addItem',function(req,res){
        res.render('addItem',{message:''});
    });

    // page after item data has been submitted
    app.post('/addItemAction',urlencodedParser,function(req,res){
        var sql="INSERT INTO `item`(`name`, `quantity`, `price`, `code`, `description`)"+
        " VALUES ('"+req.body.name+"','"+req.body.quantity+"','"+req.body.price+"','"+req.body.code+"','"+req.body.description+"')";
       connection.query(sql,function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
        });
        res.render('addItem',{message:"Added"});
    });

    // edit item page 
    app.get('/editItem',function(req,res){
        // console.log(req.query.id);
        var sql="select * from item where id="+req.query.id;
        connection.query(sql,function(error,rows,fields){
                if(!!error){
                    console.log("Error in query");
                }
                else{
                    res.render('editItem',{item:rows[0],message:''});
                }
            });
    });

    // page after item data has been submitted
    app.post('/editItemAction',urlencodedParser,function(req,res){

        var sql="UPDATE `item` SET `name`='"+req.body.name+"',`quantity`='"+req.body.quantity+"',`price`='"+req.body.price+"',`code`='"+req.body.code+"',`description`='"+req.body.description+"' WHERE `id`='"+req.body.id+"'";
        connection.query(sql,function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
        });
        sql="select * from item where id="+req.body.id;
        connection.query(sql,function(error,rows,fields){
                if(!!error){
                    console.log("Error in query");
                }
                else{
                    res.render('editItem',{item:rows[0],message:'Updated'});
                }
            });
        // res.render('editItem',{message:"Updated"});
    });

    // view Items page
    app.get('/viewItem',function(req,res){
        var sql="select * from item";
       connection.query(sql,function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
            else{
                res.render('viewItem',{items:rows,message:''});
            }
        });
    });

    // delete item page 
    app.get('/deleteItem',function(req,res){
        var sql="delete from item where id="+req.query.id;
        connection.query(sql,function(error,rows,fields){
                if(!!error){
                    console.log("Error in query");
                }
                
            });
        sql="select * from item";
        connection.query(sql,function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
            else{
                res.render('viewItem',{items:rows,message:'Deleted'});
            }
        });
    });




    app.get('/todo',function(req,res){
        res.render('todo',{todos:data});
    });
    app.post('/todo',urlencodedParser,function(req,res){
       
        data.push(req.body);
        res.json(data);
    });
    app.delete('/todo/:item',function(req,res){
        data=data.filter(function(todo){
            return todo.item.replace(/ /g,'-')!== req.params.item;
        });
        res.json(data);
    });
}