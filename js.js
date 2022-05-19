let shortLink = document.querySelector(".error");
const createBTN = document.querySelector(".create");
const mainPageWrapper = document.querySelector(".main");
const importantLinkBTN = document.querySelector(".more");
const importantLinkBackBTN = document.querySelector(".more1");
const firstPageWrapper = document.querySelector(".wrap");
const secondPageWrapper = document.querySelector(".wrap2");
const copyBTN = document.querySelector(".copy");
const importantLinkNotyfication = document.querySelector(".add");
const importantLinkNotyficationBTN = document.querySelector(".addBTN");
const newNamePopUp = document.querySelector(".popup");
const createNewLink = document.querySelector(".createNewLink");
const cancelBTN = document.querySelector(".cancel");
const newLinkValue = document.querySelector("#newLinkName");
const popUpError = document.querySelector(".popupP");
const regex =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
let longLink;
let deleteEl;
let shortLinkTab = []; //array stores a list of short links to check if the added link already exists when a new one is added
let longLinkTab = []; //longLinkTab and nameTab are needed to put the table into local storage
let nameTab = [];
let fetchError = true; // if error in fetch occurs, app will stop

async function getLink() {
  //generate a new link
  longLink = document.querySelector("#urlLong").value;
  document.querySelector("#urlLong").value = "";
  copyBTN.textContent = "Copy!";
  if (longLink !== "" && longLink.match(regex)) {
    await getNewLink();
    if (fetchError === true) {
      //if error in fetch occurs, app will stop
      shortLink.textContent = "Something went wrong, Try again";
      return;
    }
    copyBTN.classList.remove("secondPage");
    importantLinkNotyfication.classList.remove("secondPage");
    copyBTN.addEventListener("click", cpLink);
    importantLinkNotyficationBTN.addEventListener("click", enterNewLink);
  } else {
    shortLink.textContent = "Enter correct link!";
  }
}

async function getNewLink() {
  //download shortlink from api
  try {
    const res = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: "Bearer a1594cfc520f8098f2cb6473296395cf2e0874f", //Paste your API code   Bearer a1594cfc520f8098f2cb6473296395cf2e0874fd
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longLink,
        domain: "bit.ly",
      }),
    })
      .then((Response) => {
        return Response.ok
          ? Response.json()
          : Promise.reject(new Error(`Something went wrong`));
      })
      .then((Response) => {
        fetchError = false;
        shortLink.value = Response.link;
        shortLink.textContent = Response.link;
      });
  } catch (error) {
    console.log(error.message);
  }
}

function enterNewLink() {
  //naming the important links element with a check to see if such a shortened link exists
  newNamePopUp.classList.remove("secondPage");
  let tof = false;
  createNewLink.addEventListener("click", () => {
    if (newLinkValue.value != "") {
      for (let i = 0; i < shortLinkTab.length; i++) {
        if (shortLinkTab[i] === shortLink.value) {
          popUpError.classList.remove("secondPage");
          tof = true;
        }
      }
      if (tof === false) {
        addNewLink();
      }
    }
  });
  cancelBTN.addEventListener("click", () => {
    newNamePopUp.classList.add("secondPage");
    popUpError.classList.add("secondPage");
    newLinkValue.value = "";
  });
}
function addNewLink() {
  //when all is set, adding new elements to the DOM
  document.querySelector(".popupP").classList.add("secondPage");
  newNamePopUp.classList.add("secondPage");
  const newLink = document.createElement("div");
  newLink.classList.add("container");
  secondPageWrapper.appendChild(newLink);
  deleteEl = document.createElement("i");
  deleteEl.classList.add("fas");
  deleteEl.classList.add("fa-backspace");
  newLink.appendChild(deleteEl);
  const newLinkH3 = document.createElement("h3");
  newLinkH3.textContent = newLinkValue.value;
  newLink.appendChild(newLinkH3);
  const newLinkH4 = document.createElement("h4");
  newLinkH4.textContent = "Long link: ";
  newLink.appendChild(newLinkH4);
  const newLinkpLong = document.createElement("p");
  newLinkpLong.textContent = longLink;
  newLink.appendChild(newLinkpLong);
  const newLinkH42 = document.createElement("h4");
  newLinkH42.textContent = "Short link: ";
  newLink.appendChild(newLinkH42);
  const newLinkpShort = document.createElement("p");
  newLinkpShort.textContent = shortLink.value;
  newLink.appendChild(newLinkpShort);
  shortLinkTab.push(shortLink.value);
  longLinkTab.push(longLink);
  nameTab.push(newLinkValue.value);
  updateLocalStorage();
  emptyElement();
  document.querySelector("#newLinkName").value = "";
  importantLinkNotyfication.classList.add("secondPage");
}
function cpLink() {
  //copying a link to the clipboard
  navigator.clipboard.writeText(shortLink.value);
  copyBTN.textContent = "Copied!";
}
function allLinks() {
  //shows a dashboard of links
  importantLinkBackBTN.classList.toggle("secondPage");
  importantLinkBTN.classList.toggle("secondPage");
  firstPageWrapper.classList.toggle("secondPage");
  secondPageWrapper.classList.toggle("secondPage");
  secondPageWrapper.addEventListener("click", checkdel);
}
const checkdel = (e) => {
  //Removes an element from html,array and localstorage
  if (e.target.matches(".fa-backspace")) {
    const shortLink2 = e.target.closest("div").lastChild.textContent;
    shortLinkTab.forEach((element) => {
      if (element === shortLink2) {
        const index = shortLinkTab.indexOf(element);
        if (index !== -1) {
          shortLinkTab.splice(index, 1);
          longLinkTab.splice(index, 1);
          nameTab.splice(index, 1);
          updateLocalStorage();
          emptyElement();
        }
      }
    });
    e.target.closest("div").remove();
  }
};
function emptyElement() {
  //adds/removes inscription when empty panel
  if (shortLinkTab.length < 1) {
    document.querySelector(".pusto").classList.remove("secondPage");
  } else {
    document.querySelector(".pusto").classList.add("secondPage");
  }
}

function receiveElementsFromLocalStorage() {
  //gets items from localstorage
  shortLinkTab = JSON.parse(localStorage.getItem("shortLink"));
  longLinkTab = JSON.parse(localStorage.getItem("longLink"));
  nameTab = JSON.parse(localStorage.getItem("name"));
  if (shortLinkTab === null) {
    shortLinkTab = [];
    longLinkTab = [];
    nameTab = [];
  }
  emptyElement();
  for (let i = 0; i < shortLinkTab.length; i++) {
    const newLink = document.createElement("div");
    newLink.classList.add("container");
    secondPageWrapper.appendChild(newLink);
    deleteEl = document.createElement("i");
    deleteEl.classList.add("fas");
    deleteEl.classList.add("fa-backspace");
    newLink.appendChild(deleteEl);
    const newLinkH3 = document.createElement("h3");
    newLinkH3.textContent = nameTab[i];
    newLink.appendChild(newLinkH3);
    const newLinkH4 = document.createElement("h4");
    newLinkH4.textContent = "Long link: ";
    newLink.appendChild(newLinkH4);
    const newLinkpLong = document.createElement("p");
    newLinkpLong.textContent = longLinkTab[i];
    newLink.appendChild(newLinkpLong);
    const newLinkH42 = document.createElement("h4");
    newLinkH42.textContent = "Short link: ";
    newLink.appendChild(newLinkH42);
    const newLinkpShort = document.createElement("p");
    newLinkpShort.textContent = shortLinkTab[i];
    newLink.appendChild(newLinkpShort);
  }
}
function updateLocalStorage() {
  //update localstorage
  localStorage.setItem("shortLink", JSON.stringify(shortLinkTab));
  localStorage.setItem("longLink", JSON.stringify(longLinkTab));
  localStorage.setItem("name", JSON.stringify(nameTab));
}
document.addEventListener("keyup", (event) => {
  //add enter button
  if (
    event.code === "Enter" &&
    !newNamePopUp.classList.contains("secondPage") &&
    newLinkValue.value != ""
  ) {
    event.preventDefault();
    let tof = false;
    for (let i = 0; i < shortLinkTab.length; i++) {
      if (shortLinkTab[i] === shortLink.value) {
        popUpError.classList.remove("secondPage");
        tof = true;
      }
    }
    if (tof === false) {
      addNewLink();
    }
  }
});

receiveElementsFromLocalStorage();
createBTN.addEventListener("click", getLink);
importantLinkBTN.addEventListener("click", allLinks);
importantLinkBackBTN.addEventListener("click", allLinks);
