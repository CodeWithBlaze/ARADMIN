const options = [];

function submitQuestion(){
    const q = document.getElementById('question').value.toLowerCase();
    const monument = document.getElementById('monument').value.toLowerCase();
    const age = document.getElementById('age').value.toLowerCase();
    const image = document.getElementById("question-image").value;
    
    let submitObject = {
        age,
        question: q,
        monument,
        options
    }
    if(image)
        submitObject = {...submitObject,image}

    addQuestion(submitObject)
}
function addOptionsToView(value){
    document.getElementById('optionView').innerHTML += `<p>${value}</p>`;
}
function addQptions(){
    const option = document.getElementById('options').value.toLowerCase();
    options.push(option);
    addOptionsToView(option)
}