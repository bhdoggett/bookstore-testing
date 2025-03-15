let Book = require("../app/models/book");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

let should = chai.should();

chai.use(chaiHttp);

describe("Books", function () {
  beforeEach(() => Book.removeAll());

  describe("/GET book", () => {
    it("should GET all the books", function (done) {
      chai
        .request(server)
        .get("/book")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/POST book", function () {
    it("should POST a book ", function (done) {
      // arrange
      let book = {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
        pages: 301,
      };
      // act
      chai
        .request(server)
        .post("/book")
        .send(book)
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("title");
          res.body.should.have.property("author");
          res.body.should.have.property("pages");
          res.body.should.have.property("year");
          done();
        });
    });

    it("should not POST a book without pages field", function (done) {
      // arrange
      let book = {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
      };

      // act // assert

      chai
        .request(server)
        .post("/book")
        .send(book)
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.deep.equal({
            error: "The pages field is required.",
            code: "MISSING_FIELD",
            field: "pages",
          });
          done();
        });
      Book.remove(1);
    });
  });

  describe("GET /book/:id", function () {
    it("should GET a book by the given id", function (done) {
      //arrange
      let book = {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
        pages: 301,
      };

      Book.addBook(book);

      chai
        .request(server)
        .get("/book/2")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.deep.include({
            title: "The Hunger Games",
            author: "Suzanne Collins",
            year: 2008,
            pages: 301,
          });
          done();
        });
    });
  });

  describe("PUT /book/:id", function () {
    it("should UPDATE a book given the id", function (done) {
      // arrange

      const book = {
        id: 3,
        title: "The Hunger Gamez",
        author: "Suzie Collins",
        year: 2010,
        pages: 359,
      };

      Book.addBook(book);

      console.log(Book.getAll());

      chai
        .request(server)
        .put("/book/3")
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.deep.include({
            title: "The Hunger Gamez",
            author: "Suzie Collins",
            year: 2010,
            pages: 359,
          });
          done();
        });
    });
  });

  describe("DELETE /book/:id", function () {
    it("should DELETE a book given the id", function (done) {
      // arrange

      let book = {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
        pages: 301,
      };

      Book.addBook(book);

      chai
        .request(server)
        .delete("/book/4")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return an error if the book id is not found", function (done) {
      let book = {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
        pages: 301,
      };

      Book.addBook(book);

      console.log("I ran from the delete book test");
      console.log("All Books:", Book.getAll());

      chai
        .request(server)
        .delete("/book/10")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
