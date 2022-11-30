const books = [];
const RENDER_BOOK = "render-book";
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "Book_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(todoId) {
  for (const bookItem of books) {
    if (bookItem.id === todoId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(todoId) {
  for (const index in books) {
    if (books[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function makeBook(todoObject) {
  const { id, title, author, year, isCompleted } = todoObject;

  const textTitle = document.createElement("h4");
  textTitle.classList.add("title");
  textTitle.innerText = "buku : " + title;

  const textAuthor = document.createElement("h5");
  textAuthor.innerText = "penulis : " + author;

  const textyear = document.createElement("h5");
  textyear.innerText = "tahun : " + year;

  const text = document.createElement("div");
  text.classList.add("text");
  text.append(textTitle, textyear, textAuthor);

  const container = document.createElement("article");
  container.classList.add("item", "shadow", "book_item");
  container.append(text);
  container.setAttribute("id", `todo-${id}`);

  const buttondiv = document.createElement("div");
  buttondiv.classList.add("action");

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      setuju = confirm("apakah anda mau mengahapus ini?");
      if (setuju) {
        removeTaskFromCompleted(id);
      }
    });

    buttondiv.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      setuju = confirm("apakah anda mau mengahapus ini?");
      if (setuju) {
        removeTaskFromCompleted(id);
      }
    });

    buttondiv.append(checkButton, trashButton);
  }
  container.append(buttondiv);
  return container;
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  console.log(isCompleted);

  const generatedID = generateId();
  const todoObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted
  );
  books.push(todoObject);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function addTaskToCompleted(todoId) {
  const todoTarget = findBook(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findBookIndex(todoId);

  if (todoTarget === -1) return;

  books.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findBook(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      books.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
}

const search = document.getElementById("searchBookTitle");
search.addEventListener("keyup", function () {
  const List = document.getElementsByClassName("title");
  if (List == []) {
    List.style.display = "block";
  } else {
    for (const bookItem of List) {
      if (
        !bookItem.innerHTML.toLowerCase().includes(search.value.toLowerCase())
      ) {
        bookItem.parentNode.parentNode.style.display = "none";
      } else {
        bookItem.parentNode.parentNode.style.display = "flex";
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(SAVED_BOOK, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_BOOK, function () {
  const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");
  const jumlah = document.getElementById("jumlah");
  const jumlahsudah = document.getElementById("jumlahsudah");
  const jumlahbelum = document.getElementById("jumlahbelum");

  jumlah.innerHTML = `<h3>${books.length}</h3>`;
  jumlahsudah.innerHTML = `<h3>${books.filter((e) => e.isCompleted == true).length}</h3>`;
  jumlahbelum.innerHTML = `<h3>${books.filter((e) => e.isCompleted == false).length}</h3>`;

  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";
  
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});
