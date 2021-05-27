import "../css/style.css";

// Book Class Defines the Book Object
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class For UI Changes
class UI {
  // display books UI
  static displayBooksInUI(books, filter) {
    const noBooks = document.querySelector(".no-books");
    if (books.length === 0) {
      noBooks.classList.remove("hidden");
      noBooks.innerHTML =
        filter === true
          ? "No such books inside the inventory..."
          : "No books inside the inventory...";

      return;
    }
    noBooks.classList.add("hidden");
    const list = document.querySelector("#bookList");
    list.innerHTML = "";
    books.forEach((book) => UI.addBookToUI(book));
  }
  // Add Books To UI
  static addBookToUI(book) {
    const list = document.querySelector("#bookList");
    const row = document.createElement("tr");
    row.classList.add("border");
    row.innerHTML = `
    <td class="border px-2 py-1">${book.title}</td>
    <td class="border px-2 py-1">${book.author}</td>
    <td class="border px-2 py-1">${book.isbn}</td>
    <td class="border px-2 py-1">
      <a
        class="
          text-red-600
          hover:text-red-500
          active:text-red-700
          focus:ring-1 focus:ring-offset-1 focus:ring-red-400
        "
        href="#!"
        ><i class="fas fa-trash delete"></i
      ></a>
    </td>
  `;
    list.appendChild(row);
  }
  // filter Book from UI
  static filterbooks(input) {
    const list = document.querySelector("#bookList");
    list.innerHTML = "";
    const books = Store.getBooks();

    const filteredBooks = books.filter((book) => {
      const { title, author, isbn } = book;
      if (
        title.indexOf(input) > -1 ||
        author.indexOf(input) > -1 ||
        isbn.indexOf(input) > -1
      ) {
        return book;
      }
    });
    UI.displayBooksInUI(filteredBooks, true);
  }
  // Remove Book from UI
  static removeBook(el) {
    el.parentElement.parentElement.parentElement.remove();
  }
  // Show Alert
  static showAlert(msg, className) {
    const div = document.createElement("div");
    className = className === "success" ? "bg-green-400" : "bg-red-400";
    div.className = `
    ${className}
    alert
    text-white
    px-4
    py-1
    fixed
    top-5
    right-5
    duration-1000
    transition
    transform
    -translate-x-10
    `;
    div.innerHTML = msg;
    document.querySelector("body").appendChild(div);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 1500);
  }
  // Clear Feilds
  static clearFeilds() {
    const addBookForm = document.querySelector("#addBookForm");
    addBookForm.title.value = "";
    addBookForm.author.value = "";
    addBookForm.isbn.value = "";
  }
}
// store Class handles storage Changes
class Store {
  // Get books Local Storage
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  // Add Books To Local Storage
  static addbook(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  // Remove Book from Local Storage
  static removeBook(isbn) {
    let books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM Events
document.addEventListener(
  "DomContentLoaded",
  UI.displayBooksInUI(Store.getBooks())
);
// Event: Add Book
const addBookForm = document.querySelector("#addBookForm");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = addBookForm.title.value;
  const author = addBookForm.author.value;
  const isbn = addBookForm.isbn.value;

  if (title === "" || author == "" || isbn === "") {
    UI.showAlert("Please fill the values", "danger");
    return;
  }
  const book = new Book(title, author, isbn);
  // add book to UI
  UI.addBookToUI(book);
  //   add Book to Store
  Store.addbook(book);
  // show Alert
  UI.showAlert("A New Book has been Added", "success");
  // clearing Feilds
  UI.clearFeilds();
  // hide no books if books have book
  if (Store.getBooks().length > 0) {
    const noBooks = document.querySelector(".no-books");
    noBooks.classList.add("hidden");
  }
});
// Event: Remove Book
document.querySelector("#bookList").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    //   remove form Store
    Store.removeBook(
      e.target.parentElement.parentElement.previousElementSibling.textContent
    );
    //   remove form UI
    UI.removeBook(e.target);
    if (Store.getBooks().length === 0) {
      const noBooks = document.querySelector(".no-books");
      noBooks.innerHTML = "No books left inside the inventory...";
      noBooks.classList.remove("hidden");
    }
    // show no books if books is emplty
    UI.showAlert("Book was successfully deleted", "success");
  }
});
document.querySelector("#search").addEventListener("keyup", (e) => {
  if (e.target.value === "") {
    UI.displayBooksInUI(Store.getBooks(), false);
  } else {
    UI.filterbooks(e.target.value);
  }
});
