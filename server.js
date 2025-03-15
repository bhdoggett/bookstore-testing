const http = require("http");
const finalHandler = require("finalhandler");
const Router = require("router");
const bodyParser = require("body-parser");
const Book = require("./app/models/book");

// Setup router
var myRouter = Router();
myRouter.use(bodyParser.json());

beforeEach(() => Book.removeAll());
// This function is a bit simpler...
let server = http
  .createServer(function (request, response) {
    myRouter(request, response, finalHandler(request, response));
  })
  .listen(8080);

// Notice how much cleaner these endpoint handlers are...
myRouter.get("/book", function (request, response) {
  // Return all books in the db
  response.writeHead(200, { "Content-Type": "application/json" });
  return response.end(JSON.stringify(Book.getAll()));
});

myRouter.post("/book", function (request, response) {
  // If pages aren't sent, reject the request
  if (!request.body.pages) {
    response.writeHead(400, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        error: "The pages field is required.",
        code: "MISSING_FIELD",
        field: "pages",
      })
    );
  }

  // Add book to database
  const addedBook = Book.addBook(request.body);

  // Return success with added book
  response.writeHead(200, { "Content-Type": "application/json" });
  return response.end(JSON.stringify(addedBook));
});

myRouter.get("/book/:id", function (request, response) {
  // Get our query params from the query string
  //Find book to return
  const foundBook = Book.getBook(request.params.id);
  // Return 404 if not found
  if (!foundBook) {
    response.writeHead(404);
    return response.end("Book Not Found");
  }
  // Return book information
  response.writeHead(200, { "Content-Type": "application/json" });
  return response.end(JSON.stringify(foundBook));
});

myRouter.delete("/book/:id", function (request, response) {
  // Get our query params from the query string
  // Check if book exists
  const foundBook = Book.getBook(request.params.id);

  // Return 404 if not found
  if (!foundBook) {
    response.writeHead(404);
    return response.end("Book Not Found");
  }

  // Remove book from book list
  Book.remove(request.params.id);

  // Return success
  response.writeHead(200);
  return response.end();
});

myRouter.put("/book/:id", function (request, response) {
  // Get our query params from the query string
  // Check if book exists
  const foundBook = Book.getBook(request.params.id);
  console.log("foundBook:", foundBook);
  // Return 404 if not found
  if (!foundBook) {
    response.writeHead(404);
    return response.end("Book Not Found");
  }

  // Update existing book
  const updatedBook = Book.updateBook(request.body);

  response.writeHead(200, { "Content-Type": "application/json" });
  return response.end(JSON.stringify(updatedBook));
});
module.exports = server;
