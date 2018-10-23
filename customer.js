//Node Modules
var mysql = require("mysql");
var inquirer = require("inquirer");

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
  greeting();
});

//displays inventory items
function testResponse() {
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
    }
    greeting();
  });
}

//prompts user to select an item for purchase
function userPurchase() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "soldId",
          message: function() {
            var choiceArr = [];
            console.log(
              "Please enter the ID number for the item you would like to purchase.\n"
            );
            for (var i = 0; i < response.length; i++) {
              choiceArr.push(
                "\nID: " +
                  i +
                  " $" +
                  response[i].price +
                  " " +
                  response[i].product_name
              );
            }
            return choiceArr;
          },
          validate: function(id) {
            if (isNaN(id) === false && id !== null) {
              return true;
            }
            console.log("Please enter the ID #.");
            return false;
          }
        },
        {
          type: "input",
          name: "qtyPurchased",
          message: "How many would you like to purchase?",

          //checks to see if qty is a number
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
      ])
      .then(function(user) {
        //this will be where the table is Updated in the database

        //assigning varibles
        var id = user.soldId;
        var qtyPur = response[id].on_hand_qty - user.qtyPurchased;
        var sqlId = parseFloat(user.soldId) + 1;

        //checks to see if quantity to be purchased is available from inventory
        if (response[id].on_hand_qty >= user.qtyPurchased) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                on_hand_qty: qtyPur
              },
              {
                id: sqlId
              }
            ],
            function(err) {
              if (err) throw err;
              console.log(
                `You Selected \n${response[id].id} : ${
                  response[id].product_name
                } \nTotal:  $${user.qtyPurchased * response[id].price}`
              );
              return greeting();
            }
          );
        } else {
          console.log(
            `Stock Levels on the ${
              response[id].product_name
            } are too low. Only ${
              response[id].on_hand_qty
            } Available.\n**Make another selection**\n`
          );
          return greeting();
        }
      });
  });
}

//start of app Asks for a confirmation of either a purchase or inventory view
function greeting() {
  inquirer
    .prompt([
      {
        name: "buyer",
        type: "confirm",
        message: "Would you like to make a Purchase?",
        default: true
      }
    ])
    .then(function(response) {
      if (response.buyer === true) {
        return userPurchase();
      }
      inquirer
        .prompt([
          {
            name: "shopper",
            type: "confirm",
            message: "Would you like to to View our Inventory?",
            default: true
          }
        ])
        .then(function(response) {
          if (response.shopper === true) {
            return testResponse();
          }
          console.log("Then I Cannot Help You. \n**Goodbye**");
          connection.end();
        });
    });
}


