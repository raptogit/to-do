const express = require("express")
const bodyParser = require("body-parser")
const mongoose=require("mongoose")
const app = express()
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
app.set('view engine', 'ejs');
const itemsSchema ={
    name: String,
  };
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
    name:"Welcome to your todolist"
});
const item2=new Item({
    name:"Use + sign to add your task !"
});
const item3=new Item({
    name:"Click on the item if you finish your task"
});

const defaultItems=[item1,item2,item3];
Item.insertMany(defaultItems,function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Success");
    }
    
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
    
    res.render("list", { listTitle: "Today", newItem: items });
})

app.post("/", function (req, res) {
    var item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }

    items.push(item);

})
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List Bro", newItem: workItems });

})

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect(
        "/work"
    )
})

app.get("/about", function (req, res) {
    res.render("about");
})
app.listen(3000, function () {
    console.log("Server started you ass");
})