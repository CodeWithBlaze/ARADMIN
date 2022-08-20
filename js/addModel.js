let images = [];
let selectedFile = null;
function addImage(){
    const url = document.getElementById('image').value;
    document.getElementById('images-list').innerHTML += `<li class="url-list" onclick="deleteImage('${url}')">${url}</li>`;
    images.push(url);
}
function replaceImageList(imageList){
    let element  = "";
    for(let image in imageList)
        element+= `<li class="url-list" onclick="deleteImage('${imageList[image]}')">${imageList[image]}</li>`;
    document.getElementById('images-list').innerHTML = element;
}
function deleteImage(url){
    const filteredImages = images.filter(image=>image!=url)
    replaceImageList(filteredImages);
    images = filteredImages;
}
function uploadFile(){
    document.getElementById('file-upload').click()
}
function uploadFileToDatabase(){
    if(!selectedFile)
        alert("No File Selected")
    else
        uploadFileToStorage(selectedFile)
}

async function onComplete(){
    const name = document.getElementById('name').value;
    const streetView = document.getElementById('street-view').value;
    const url = await getDownloadUrl(selectedFile.name)
    addDataToDatabase({
        name,
        streetView,
        url,
        images
    })
}
document.getElementById('file-upload').addEventListener('change',(event)=>{
    selectedFile = event.target.files[0];
    document.getElementById('selected-file').innerText = selectedFile.name;
})
document.getElementById('add-model-form').addEventListener('submit',(event)=>{
    event.preventDefault()
})