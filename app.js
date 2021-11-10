const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Pass = require(__dirname+"/Pass")
const app = express()
const _=require("lodash")
mongoose.connect("mongodb+srv://admin-rohan:"+Pass+"@cluster0.qlcjp.mongodb.net/todolistDB", { useNewUrlParser: true });
app.set('view engine', 'ejs');
const itemsSchema = {
    name: String,
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Welcome to your todolist"
});
const item2 = new Item({
    name: "Use + sign to add your task !"
});
const item3 = new Item({
    name: "<-- Click on this to remove item"
});

const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemsSchema],
}
const List = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }

    });

})

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName,
    })
    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        })
    }

})
app.post("/delete", function (req, res) {
    const listName = req.body.listName;
    const checkItem=req.body.checkbox
    if (listName === "Today") {
        Item.findByIdAndRemove(checkItem, function (err) {
            if (!err) {
                res.redirect("/");
            } else {
                console.log(err);
            }
        })
    }
    
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItem}}}, function(err, foundList){
          if (!err){
            res.redirect("/" + listName);
          }
        });
      }
});
app.get("/:id", function (req, res) {
    const customList = _.capitalize(req.params.id);
    List.findOne({ name: customList }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customList,
                    items: defaultItems,
                })
                list.save()
                res.redirect("/" + customList)
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    })

})
app.get("/about", function (req, res) {
    res.render("about");
})
app.listen(process.env.PORT, function () {
    console.log("Server started you ass");
})


