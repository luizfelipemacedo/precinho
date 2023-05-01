const instruction = document.querySelector('#resultado > .instruction');
const lista = document.querySelector('#resultado > #lista');
const searchInputField = document.querySelector('#search-area .search-bar input');
searchInputField.addEventListener('input', searchChangedEvent);

instruction.style.display = "";
lista.style.display = "none";

function searchChangedEvent(){
    var inputText = String(this.value);
    if(inputText.length > 0){
        instruction.style.display = "none";
        lista.style.display = "";
    }
    else{
        instruction.style.display = "";
        lista.style.display = "none";
    }
}
