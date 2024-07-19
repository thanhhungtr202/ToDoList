import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Utrt@2002",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
];

async function getItems(){
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
  } catch(error){
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  //When calling async function, make sure to use await, otherwise it won't wait for response since the function is async and it will move on to the next line
  await getItems();
  res.render("index.ejs", {listTitle: "Today", listItems: items});
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  console.log(req.body);
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [req.body.updatedItemTitle, req.body.updatedItemId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
