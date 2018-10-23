//Node Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var userName = [];

//create connection to the localhost database
var connection = mysql.createConnection({
  host: "localhost",

  //port 3306
  port: 3306,

  //userName
  user: "root",

  //password
  password: "",

  //database
  database: "bamazon_db"
});

//runs connect function to mysql
connection.connect(function(err) {
  if (err) throw err;
  managerLog();
  
});

//login info
function managerLog(){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        inquirer.prompt([
            {
            type: "input",
            message: "Enter your Username",
            name: "userName"
            },{
                type: "password",
                message: "Enter a Password.",
                name: "password",
                validate: function(pass){
                    if (pass === "12345" || pass === "password"){
                        console.log("\nWelcome back");
                        return true;
                    } 
                    console.log("\nYou dont work here.");
                        return false;
                }
            }
        ]).then(function(res){
            userName.push(res.userName);
            console.log("\nHello, How can we assist you today " + userName + "?");
            
            //place inquier prompt to to provide the choices to the manager
            menuChoices();
            
        })
})
}

//picks a catagory
function menuChoices (){
    inquirer.prompt([
        {
          type: "list",
          name: "adminChoice",
          message: "How can we assit?\nPlease select how you would like to Interact with Inventory.",
          choices: ["Review", "Replenish", "Remove", "Create", "Quit"]  
        }
    ]).then(function(response){
       
        return inventoryControl(response.adminChoice);
    })
}


//this will allow for Creation, Reading, Updating, and Deletion
function inventoryControl(adminChoice){
    
        switch (adminChoice) {
            
            case "Review":
                return review();
            
            case "Replenish":
                return replenish();

            case "Remove":
                return deleteItem();

            case "Create":
                return createItem();
            
            case "Quit":
                console.log(`Goodbye ${userName}. \nSee you Again!`)
                connection.end();
        }

};

//increase stock levels
function replenish(){
    connection.query("SELECT * FROM products", function(err, database) {
        if (err) throw err;

    inquirer.prompt([
        {
        type: "input",
        name: "chosen",
        message: function (){
           var itemArr = [];
           
           console.log("Enter the ID for the Product you would like to Replenish.\n");
          
           for (var i = 0; i < database.length; i++){
               itemArr.push("\nID " + database[i].id + " " + database[i].product_name + " On Hand Quantity: " + database[i].on_hand_qty);
               
           }
           return itemArr;
        },
        validate: function(value) {
            if (isNaN(value) === false && value > 0) {
              return true;
            }
            console.log(
              "\nPlease enter a Number or a Value Greater Than Zero."
            );
            return false;
          }
        },{
        type: "input",
        name: "amount",
        message: "How many units would you like to Add?",
        validate: function(value) {
            if (isNaN(value) === false && value > 0) {
              return true;
            }
            console.log(
              "\nPlease enter a Number or a Value Greater Than Zero."
            );
            return false;
          }
        }
    ]).then(function(item){
        //use SQL tools to adjust on_hand_qty
        var sqlId = parseFloat(item.chosen) - 1;
        var adj = database[sqlId].on_hand_qty + parseFloat(item.amount);
        
        connection.query("UPDATE products SET ? WHERE ?",
        [
            {
            on_hand_qty: adj
            },{
                id: item.chosen
            }
        ],
        function (err){
            if (err) throw err;
             console.log(`Update Complete! \n${database[sqlId].product_name} \nNew On Hand Total is ${adj}`);
            }
            )
            menuChoices();
    }) 
});
};

//delete items from the database
function deleteItem(){
    connection.query("SELECT * FROM products", function(err, database) {
        if (err) throw err;

    inquirer.prompt([
        {
        type: "input",
        name: "chosen",
        message: function (){
           var itemArr = [];
            var id = 1
           console.log("Enter the ID for the Product you would like to Delete.\n");
          
           for (var i = 0; i < database.length; i++){
               itemArr.push("\nID " + database[i].id + " " + database[i].product_name + " On Hand Quantity: " + database[i].on_hand_qty);
           }
           return itemArr;
        }
        },{
            type: "confirm",
            message: "**Warning**\nAre you certain you want to Delete ?",
            name: "delete"
        }
    ]).then(function(item){
        //if delete true delete this item
        connection.query("DELETE FROM products WHERE ?",
        [{
            id: item.chosen
        }],
        function(err){
            if (err) throw err;
            console.log(`Item Deleted!`)

        })
        
        menuChoices();
    }) 
});
    
};

function createItem(){
    connection.query("SELECT * FROM products", function(err, database) {
       console.log(database);
       menuChoices();
});
    
};

function review(){
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        console.log(
          `\n***************************Inventory***************************`
        );
        console.log(`\nID:   *Product*   *Price*  *QTY*\n`);
    
        for (var i = 0; i < response.length; i++) {
          var items = response[i];
          console.log(`${items.id}  || ${items.product_name} ** ${items.price} ** ${
            items.on_hand_qty
          } 
            **Department: ${items.dept_name}
            ---------------------------`);
        };
        menuChoices();
      });
};

