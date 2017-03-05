var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports=function(app,connection){
    
    app.get('/salesDashboard',function(req,res){
        console.log('test');
        res.render('salesDashboard');
    });

    app.get('/addSales',function(req,res){
        res.render('addSales',{message:''});
    });

     app.get('/getItemAjax/:id',function(req,res){
        //  console.log(req.params);
       var sql="select * from item where name like '%"+req.params.id+"%'";
        connection.query(sql,function(error,rows,fields){
                if(!!error){
                    console.log("Error in query");
                }
                else{
                    // console.log(rows);
                    res.json(rows);
                }
            });
        // res.json(data);
    });

    // afte checkout has been done
    app.post('/addSalesAction',urlencodedParser,function(req,res){
    //     var sql="INSERT INTO `item`(`name`, `quantity`, `price`, `code`, `description`)"+
    //     " VALUES ('"+req.body.name+"','"+req.body.quantity+"','"+req.body.price+"','"+req.body.code+"','"+req.body.description+"')";
    
    var sql="INSERT INTO `sales`( `amount`, `date`,`customer_info`) VALUES (?,now(),?)";
    connection.query(sql,[req.body.total,req.body.customer_info],function(error,rows,fields){
        if(!!error){
            console.log("Error in query");
        }
        else{
            var insertId=rows.insertId;
            var ids=req.body['id[]'];
            var quantities=req.body['quantity[]'];
            var prices=req.body['price[]'];
            
            // console.log(ids);
            for(i=0;i<ids.length;i++){
                var sql2="INSERT INTO `sales_item`( `sales_id`, `item_id`,`quantity`, `price`) VALUES (?,?,?,?)";
                if(ids.constructor === Array){
                    id=ids[i];
                    quantity=quantities[i];
                    price=prices[i];
                }
                else{
                    id=ids;
                    quantity=quantities;
                    price=prices;
                }

                connection.query(sql2,[insertId,id,quantity,price],function(error,rows,fields){
                    if(!!error){console.log("Error in query");}
                });

                var sql3="UPDATE `item` SET quantity= quantity-? WHERE `id`=?";
                connection.query(sql3,[quantity,id],function(error,rows,fields){
                    if(!!error){console.log("Error in query");}
                });
            }
            // console.log(rows);
        }
    });
    // console.log(req.body);
        res.render('addSales',{message:'Sales Added'});
    });
    

    app.get('/viewSales',function(req,res){
        var sql="select id,amount,DATE_FORMAT(date, '%Y-%m-%d') date,customer_info from sales order by id desc";
        connection.query(sql,function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
            else{
                res.render('viewSales',{sales:rows,message:''});
            }
        });        
    });

    app.get('/viewInvoice',function(req,res){
        var sql="SELECT i.id,i.name,si.quantity,si.price FROM `sales_item` si join item i on i.id=si.item_id where si.sales_id=?"

        connection.query(sql,[req.query.id],function(error,rows,fields){
            if(!!error){
                console.log("Error in query");
            }
            else{
                res.render('viewInvoice',{items:rows,message:''});
            }
        }); 
        
    });
        
    
}