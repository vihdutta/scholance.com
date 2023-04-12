let suggestions = []
fetch("../static/json/suggestions_list.json")
.then(response => {
   return response.json();
})
.then(data => suggestions = data);

const searchWrapper = document.querySelector("#search-input");
const inputBox = searchWrapper.querySelector("input");
const suggestionBox = searchWrapper.querySelector("#autocom-box");

inputBox.onkeyup = (e) => {
    let userInput = e.target.value;
    let emptyArray = [];

    if (userInput) {
        emptyArray = suggestions.filter((data)=> {
            return data.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase());
        }).slice(0, 5);
        emptyArray = emptyArray.map((data) => {
            return data = "<li>" + data + "</li>";
        });
        console.log(emptyArray);
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);

        let allList = suggestionBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        searchWrapper.classList.remove("active");
    }
}

function select(element) {
    let selectUserInput = element.textContent;
    inputBox.value = selectUserInput;
} 

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = "<li>" + userValue + "</li>";
    } else {
        listData = list.join("");
    }
    suggestionBox.innerHTML = listData;
}