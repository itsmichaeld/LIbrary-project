const addBook = document.querySelector(".add-book");
const formClose = document.querySelector("#form-close");
const container = document.querySelector(".form-overlay");
const formBtn = document.querySelector("#form-btn");
const hiddenForm = document.querySelector(".hidden-form");
const removeBookBtn = document.querySelector(".remove-book");
const table = document.querySelector("#main-table-body");
let bookRead = document.querySelector(".toggleRead");

//Button event listeners
addBook.addEventListener("click", function () {
  container.style.display = "flex";
});

formClose.addEventListener("click", function () {
  container.style.display = "none";
});

//Constructor function
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

formBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const read = false;

  const book = new Book(title, author, pages, read);
  addBookToLibrary(book);
  makeRow(table, myLibrary);
  container.style.display = "none";
  // clearForm();
});

function makeRow(table, myLibrary) {
  table.innerHTML = myLibrary
    .map((book, i) => {
      return `<tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.pages}</td>
    <td><input type="checkbox" data-index=${i} class="toggleRead"></td>
    <td><a href="#" class="remove-book">X</a></td>
    </tr>`;
    })
    .join("");
}

table.addEventListener("click", function (e) {
  removeBook(e.target);
  toggleRead(e.target);
});

function removeBook(el) {
  if (el.classList.contains("remove-book")) {
    el.parentElement.parentElement.remove();
    for (let i = 0; i < myLibrary.length; i++) {
      if (
        myLibrary[i].title ===
        el.parentElement.parentElement.firstElementChild.textContent
      ) {
        myLibrary.splice(i, 1);
      }
    }
    updateLocalStorage();
    makeRow(table, myLibrary);
    //This changes the read status of all books to false after an item is removed. I couldnt figure out how to deal with the change in index position. I want to fix this sometime. The simplest solution was to reset the status of them all. TO FIX!!!!
    for (let j = 0; j < myLibrary.length; j++) {
      if (myLibrary[j].read == true) {
        myLibrary[j].read = false;
      }
    }
  }
}

function toggleRead(el) {
  if (el.classList.contains("toggleRead")) {
    const index = el.dataset.index;
    if (myLibrary[index].read == false) {
      el.setAttribute("checked", true);
      myLibrary[index].read = true;
    } else if (myLibrary[index].read == true) {
      myLibrary[index].read = false;
    }
  }
  updateLocalStorage();
}

function getBooks() {
  if (localStorage.getItem("myLibrary") === null) {
    myLibrary = [];
  } else {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    makeRow(table, myLibrary);
  }
  return myLibrary;
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  updateLocalStorage();
}

window.addEventListener("DOMContentLoaded", function () {
  getBooks();
});

function updateLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = "";
}
