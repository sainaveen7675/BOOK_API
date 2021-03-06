require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database");

// models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialization 
const booky = express();

// Configuration
booky.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
).then(() => console.log("connection established..!!!"));

/*
Route         /
Description   Get all books
Access        Public
Parameter     None
Methods       GET
*/
booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route         /is
Description   Get specific book based on ISBN
Access        Public
Parameter     ISBN
Methods       GET
*/
booky.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

  // const getSpecificBook = database.books.filter(
  //   (book) => book.ISBN === req.params.ISBN
  // )

  // --> null = !
  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});


/*
Route         /la
Description   Get list of books based on languages
Access        Public
Parameter     language
Methods       GET
*/
booky.get("/la/:language", async (req, res) => {

  const getLanguageBooks = await BookModel.findOne({ language: req.params.language });
  
  if (!getLanguageBooks) {
    return res.json({
      error: `No book found for the language of ${req.params.language}`,
    });
  }

  return res.json({ book: getLanguageBooks });
});


/*
Route         /c
Description   Get specific book based on category
Access        Public
Parameter     category
Methods       GET
*/
booky.get("/c/:category", async (req, res) => {

  const getCategoryBook = await BookModel.findOne({
    category: req.params.category,
  });

  // const getSpecificBook = database.books.filter(
  // (book) => book.category.includes(req.params.category)
  // );

  if (!getCategoryBook) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getCategoryBook });
});
/*
Route         /author
Description   Get all authors
Access        Public
Parameter     None
Methods       GET
*/
booky.get("/author", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({getAllAuthors})
});

/*
Route         /author
Description   Get specific authors 
Access        Public
Parameter     name
Methods       GET
*/

booky.get("/author/:name", async (req, res) => {

  const getSpecificAuthor = await AuthorModel.findOne({ name: req.params.name });
   
  if (!getSpecificAuthor) {
      return res.json({
        error: `No author found for the name of ${req.params.name}`,
      });
    }
  
    return res.json({ author: getSpecificAuthor });
})

/*
Route         /author/book
Description   Get all authors based on books
Access        Public
Parameter     isbn
Methods       GET
*/
booky.get("/author/book/:books", async (req, res) => {
  const getBookAuthor = await AuthorModel.findOne({ books: req.params.books });
  
    if (!getBookAuthor) {
      return res.json({
        error: `No author found for the book of ${req.params.books}`,
      });
    }
  
    return res.json({ book: getBookAuthor });
})

/*
Route         /publications
Description   Get all publication
Access        Public
Parameter     None
Methods       GET
*/
booky.get("/publications", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({ getAllPublications });
});

/*
Route         /publications
Description   Get specific publication 
Access        Public
Parameter     name
Methods       GET
*/
booky.get("/publications/:name", async (req, res) => {
  const getSpecificpublication = await PublicationModel.findOne({ name: req.params.name });
  
    if (!getSpecificpublication) {
      return res.json({
        error: `No publication found for the name of ${req.params.name}`,
      });
    }
  
    return res.json({ publications: getSpecificpublication });
})

/*
Route         /publications/books
Description   Get list of publications based on book 
Access        Public
Parameter     isbn
Methods       GET
*/
booky.get("/publications/books/:ISBN", async (req, res) => {
  const getBookPublication = await PublicationModel.findOne({ books: req.params.ISBN });
  
    if (!getBookPublication) {
      return res.json({
        error: `No publication found for the book of ${req.params.ISBN}`,
      });
    }
  
    return res.json({ publications: getBookPublication });
})

/*
Route         /book/add
Description   Add new book
Access        Public
Parameter     None
Methods       POST
*/
booky.post("/book/add", async (req, res) => {
  const { newBook } = req.body;
  BookModel.create(newBook);
  return res.json({ message: "new book is added" });
});

/*
Route         /author/add
Description   Add new author
Access        Public
Parameter     None
Methods       POST
*/
booky.post("/author/add", (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);
  return res.json({ message: "new author is added"});
})

/*
Route         /book/update/title/
Description   Update book title
Access        Public
Parameter     ISBN
Methods       PUT
*/
booky.put("/book/update/title/:isbn", async (req, res) => {

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.newBookTitle;
  //     return;
  //   }
  // });

  return res.json({ books: updatedBook });
});

/*
Route         /book/update/author
Description   Update/add new author for the book
Access        Public
Parameter     ISBN
Methods       PUT
*/
booky.put("/book/update/author/:isbn", async (req, res) => {
  // update book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors : req.body.newAuthor,
      }
    },
    {
      new: true,
    }
    );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     return book.author.push(parseInt(req.params.authorId));
  //   }
  // });
  
  // // update author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  // database.author.forEach((author) => {
  //   if (author.id === parseInt(req.params.authorId))
  //   return author.books.push(req.params.isbn);
  // });

  return res.json({ 
    books: updatedBook,
    author: updatedAuthor,
    message: "new author was updated", 
  });
});

/*
Route         /author/update/name/
Description   Update author name
Access        Public
Parameter     id
Methods       PUT
*/
booky.put("/author/update/name/:id", async (req, res) => {

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      name: req.body.newAuthorName,
    },
    {
      new: true,
    }
  );

  // database.author.forEach((author) => {
  //   if (author.id === parseInt(req.params.id)) {
  //     author.name = req.body.newAuthorName;
  //     return;
  //   }
  // });

  return res.json({ author: updatedAuthor });
});

/*
Route         /publication/add
Description   Add new publications
Access        Public
Parameter     None
Methods       POST
*/
booky.post("/publication/add", (req, res) => {
  const { newPublication } = req.body;
  PublicationModel.create(newPublication);
  return res.json({ message: "new publication is added" });
});

/*
Route         /publication/update/name/
Description   Update the publication name
Access        Public
Parameter     id
Methods       PUT
*/
booky.put("/publication/update/name/:id", async (req, res) => {

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      name: req.body.newPublicationName,
    },
    {
      new: true,
    }
  );

  // database.publication.forEach((publication) => {
  //   if (publication.id === parseInt(req.params.id)) {
  //     publication.name = req.body.newPublicationName;
  //     return;
  //   }
  // });

  return res.json({ publication: updatedPublication });
});

/*
Route         /publication/update/book
Description   Update/add books to publications
Access        Public
Parameter     isbn
Methods       PUT
*/
booky.put("/publication/update/book/:isbn", async (req, res) => {
  // update the publication database

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubId,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      }
    },
    {
      new: true,
    }
  );

  // database.publication.forEach((publication) => {
  //   if(publication.id === req.body.pubId) {
  //     return publication.books.push(req.params.isbn);
  //   }
  // });
  // update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        publication: req.body.pubId,
      }
    },
    {
      new: true,
    },
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.publication = req.body.pubId;
  //     return;
  //   }
  // });

  return res.json({
    books: updatedBook, 
    publication: updatedPublication, 
    message: "Successfully updated publication",
  });
});

/*
Route         /book/delete
Description   Delete a book
Access        Public
Parameter     isbn
Methods       DELETE
*/
booky.delete("/book/delete/:isbn", async (req, res) => {

  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  // const updatedBookDatabase = database.books.filter(
  //   (book) => book.ISBN !== req.params.isbn
  // );
  
  // database.books = updatedBookDatabase;
  return res.json({ books: updatedBookDatabase });
});

/*
Route         /author/delete
Description   Delete a author
Access        Public
Parameter     id
Methods       DELETE
*/
booky.delete("/author/delete/:id", async (req, res) => {

  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: req.params.id,
  });

  // const updatedAuthorDatabase = database.author.filter(
  //   (author) => author.id !== parseInt(req.params.id)
  // );
  
  // database.author = updatedAuthorDatabase;
  return res.json({ author: updatedAuthorDatabase })
});

/*
Route         /book/delete/author
Description   Delete an author from the book
Access        Public
Parameter     isbn, author id
Methods       DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
  // update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorId),
      }
    },
    {
      new: true
    }
  );


  // database.books.forEach((book) => {
  //   if(book.ISBN === req.params.isbn){
  //     const newAuthorList = book.authors.filter(
  //       (author) => author !== parseInt(req.params.authorId)
  //     );
  //     book.authors = newAuthorList;
  //     return;
  //   }
  // });

  // update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    },
  );

  // database.author.forEach((author) => {
  //   if(author.id === parseInt(req.params.authorId)){
  //     const newBookList = author.books.filter(
  //       (book) => book !== req.params.isbn
  //     );

  //     author.books = newBookList;
  //     return;
  //   }
  // });
  return res.json({
    message: "author was deleted",
    books: updatedBook, 
    author:updatedAuthor
  });
});

/*
Route         /publication/delete
Description   Delete a publication
Access        Public
Parameter     id
Methods       DELETE
*/
booky.delete("/publication/delete/:id", async (req, res) => {

  const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
    id: req.params.id,
  });

  // const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
  //   id: req.params.id,
  // });
  
  // database.publication = updatedPublicationDatabase;
  return res.json({ publication: updatedPublicationDatabase })
});


/*
Route         /publication/delete/book
Description   Delete a book from publication
Access        Public
Parameter     isbn, publication id
Methods       DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
  // update publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.params.pubId,
    },
    {
      $pull: {
        books: req.params.isbn,
      }
    },
    {
      new: true,
    }
  );

  // database.publication.forEach((publication) => {
  //   if(publication.id === parseInt(req.params.pubId)){
  //     const newBooksList = publication.books.filter(
  //       (book) => book !== req.params.isbn
  //     );
  //     publication.books = newBooksList;
  //     return;
  //   }
  // });
  
  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        publication: req.params.pubId,
      },
    },
    {
      new: true,
    },
  );

  // database.books.forEach((book) => {
  //   if(book.ISBN === req.params.isbn){
  //     book.publication = 0;
  //     return;
  //   }
  // });

  return res.json({books: updatedBook, publications: updatedPublication });
});

booky.listen(3000, () => console.log("Hey server is running!"));