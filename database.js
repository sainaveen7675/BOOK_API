const books = [
    {
      ISBN: "12345Book",
      title: "Getting started with MERN",
      pubDate: "2021-07-07",
      language: "en",
      numPage: 250,
      author: [1, 2],
      publications: [1],
      category: ["tech", "programming", "education", "thriller"],
    },
  ];
  
  const author = [
    {
      id: 1,
      name: "Sainaveen",
      books: ["12345Book"],
    },
    { id: 2,
      name: "Elon Musk", 
      books: ["12345Book", "1234566789Secret"]
    },
  ];
  
  const publication = [
    {
      id: 1,
      name: "writex",
      books: ["12345Book"],
    },
  ];

  module.exports = {books, author, publication};