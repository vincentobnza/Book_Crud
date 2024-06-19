const express = require("express");
const router = express.Router();
const Book = require("../models/books");

// Insert book
router.post("/books/create", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishedDate: req.body.publishedDate,
      genre: req.body.genre,
      description: req.body.description,
      lastUpdated: Date.now(),
    });
    await book.save();
    req.session.message = {
      message: "Book published successfully ✔️",
    };
    setTimeout(() => {
      req.session.message;
    }, 3000);
    res.redirect("/books");
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/", (req, res) => {
  try {
    res.render("index", { title: "Home Page" });
  } catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ lastUpdated: -1 }).exec();
    res.render("books", {
      title: "Published Books",
      books: books,
      message: req.session.message,
    });
    req.session.message = null;
  } catch (error) {
    console.error("Error rendering books page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// create book
router.get("/books/create", (req, res) => {
  try {
    res.render("create", { title: "Create Book" });
  } catch (error) {
    console.error("Error rendering create book page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// get book details
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render("view", {
      title: book.title,
      book: book,
      id: req.params.id,
    });
  } catch (error) {
    console.error("Error rendering book details page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// edit book
router.get("/books/edit/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render("edit", {
      title: book.title,
      book: book,
      id: req.params.id,
    });
  } catch (error) {
    console.error("Error rendering edit book page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// update book

router.post("/books/update/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishedDate = req.body.publishedDate;
    book.genre = req.body.genre;
    book.description = req.body.description;
    book.lastUpdated = Date.now();
    await book.save();

    res.redirect("/books");
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Internal Server Error");
  }
});

// delete book
router.get("/books/delete/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
