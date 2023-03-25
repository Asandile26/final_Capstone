// Database configurations
const run = require('../config');
//bcrypt module
const { hash, compare, hashSync } = require('bcrypt');
//middleware for creating tokens
const { createToken} = require('../middleware/AuthenticatedUser')
// User 
class User {
    login(req, res) {
        const {emailAdd, userPass} = req.body;
        const box = 
        `
        SELECT firstName, lastName, gender, cellphoneNumber, emailAdd, userPass, userRole, userProfile
        FROM Users
        WHERE emailAdd = '${emailAdd}';
        `;
        run.query(box, async (err, data)=>{
            if(err) throw err;
            if((!data.length) || (data == null)) {
                res.status(401).json({err: 
                    "You provide a wrong email address"});
            }else {
                await compare(userPass, 
                    data[0].userPass, 
                    (cErr, cResult)=> {
                        if(cErr) throw cErr;
                        // Create a token
                        const jwToken = 
                        createToken(
                            {
                                emailAdd, userPass  
                            }
                        );
                        // Saving
                        res.cookie('LegitUser',
                        jwToken, {
                            maxAge: 3600000,
                            httpOnly: true
                        })
                        if(cResult) {
                            res.status(200).json({
                                msg: 'Logged in',
                                jwToken,
                                result: data[0]
                            })
                        }else {
                            res.status(401).json({
                                err: 'Password incorrect or did not register.'
                            })
                        }
                    })
            }
        })     
    }
    fetchUsers(req, res) {
        const box = 
        `
        SELECT userID, firstName, lastName, gender, cellphoneNumber, emailAdd, userRole, userProfile, joinDate
        FROM Users;
        `;
        //database
        run.query(box, (err, data)=>{
            if(err) throw err;
            else res.status(200).json( 
                {results: data} );
        })
    }
    fetchUser(req, res) {
        const box = 
        `
        SELECT userID, firstName, lastName, gender, cellphoneNumber, emailAdd, userRole, userProfile, joinDate
        FROM Users
        WHERE userID = ?;
        `;
        //database
    run.query(box,[req.params.id], 
            (err, data)=>{
            if(err) throw err;
            else res.status(200).json( 
                {results: data} );
        })

    }
    async createUser(req, res) {
        try {
          // Payload
          var fast = req.body;
          // Hashing user password
          fast.userPass = await hash(fast.userPass, 12);
          // For authentication
          let user = {
            emailAdd: fast.emailAdd,
            userPass: fast.userPass
          };
          // SQL query
          const box = `INSERT INTO Users SET ?;`;
          await run.query(box, [fast]);
          // Create a token
          const jwToken = createToken(user);
          // This token will be saved in the cookie
          // The duration is in milliseconds.
          res.cookie("LegitUser", jwToken, {
            maxAge: 3600000,
            httpOnly: true
          });
          res.status(200).json({ message: "A user record was saved." });
        } catch (err) {
          res.status(401).json({ err });
        }
      }
      
      async updateUser(req, res) {
        let sage = req.body;
        if (sage.userPass !== null && sage.userPass !== undefined) {
          sage.userPass = hashSync(sage.userPass, 12);
        }
        const box = `
          UPDATE Users
          SET ?
          WHERE userID = ?;
        `;
        run.query(box, [sage, req.params.id], (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "An error occurred" });
          } else {
            res.status(200).json({ message: "A row was affected" });
          }
        });
      }
      
      

      
    deleteUser(req, res) {
        const box = 
        `
        DELETE FROM Users
        WHERE userID = ?;
        `;
        //database
        run.query(box,[req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {message: 
                "A user was removed from a database"} );
        })    
    }
}
// Product
class Product {
    fetchProducts(req, res) {
        const box = `SELECT prodID, prodName, descript, categories, price, size, imgURL,color
        FROM Products;`;
        run.query(box, (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    fetchProduct(req, res) {
        const box = `SELECT prodID, prodName, descript, categories, price, size, imgURL, color
        FROM Products
        WHERE prodID = ?;`;
        run.query(box, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
    addProduct(req, res) {
        const box = `
        INSERT INTO Products
        SET ?;`;
        run.query(box,[req.body], (err)=> {
            if(err){
                res.status(400).json({err})
            } else {
                res.status(200).json({message: "An item was added."})
            }
        })
    }
    
    updateProduct(req, res) {
        const box = 
        `
        UPDATE Products
        SET ?
        WHERE prodID = ?
        `;
        run.query(box,[req.body, req.params.id],
            (err)=> {
                if(err){
                    console.log(err);
                    res.status(400).json({err: "Unable to update a item."});
                }else {
                    res.status(200).json({message: "Item is  updated"});
                }
            }
        );    

    }
    deleteProduct(req, res) {
        const box = 
        `
        DELETE FROM Products
        WHERE prodID = ?;
        `;
        run.query(box,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The item was not found."});
            res.status(200).json({message: "An item was deleted."});
        })
    }

}
//Cart
 class Cart{
    fetchCart(req, res) {
        const box = `SELECT cartId, userID, cart JSON FROM Cart WHERE userID = ?;`;
        run.query(box, [req.params.id], (err, data) => {
            if (err) throw err;
            else {
                if (data.length === 0) {
                    res.status(200).json({ message: "Cart is empty" });
                } else {
                    res.status(200).json({ results: data });
                }
            }
        });
    };
    fetchCartById(req, res) {
        const box = `SELECT cartID, userID, cart JSON
        FROM Cart
        WHERE userID = ?;`;
        run.query(box, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
  addToCart(req, res) {
    const box = `
    INSERT INTO Cart SET ?;`;
    run.query(box,[req.body], (err)=>{
        if(err){
            res.status(400).json({err})
            } else {
                res.status(200).json({message: "An item was added."}) 
        }
    } )
  }
  UpdateCart(req, res) {
    const box = ` UPDATE Cart SET ? WHERE cartID = ?`;
    run.query(box,[req.body, req.params.id],
        (err)=> {
            if(err){
                res.status(400).json({err: "Unable to update a item."});
            }else {
                res.status(200).json({message: "Item is  updated"});
            }
        }
    );   
  }
  deleteCart(req, res) {
    const box = `
    DELETE FROM Cart
    WHERE cartID = ?;
    `;
    run.query(box, [req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({ error: "The item was not found." });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "The item was not found." });
        } else {
            res.status(200).json({ message: "An item was deleted." });
        }
    });
}

}
    
// Export User class
module.exports = {
    User, 
    Product,
    Cart
}