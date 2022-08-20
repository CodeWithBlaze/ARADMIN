let annotationObj = []
let images = []
function createElement(modelViewerData){
    const element = document.createElement('div');
    element.innerHTML = modelViewerData;
    return element
}
function createHtmlTag(){
    const modelViewerData = document.getElementById('model-viewer-data').value;
    const element = createElement(modelViewerData)
    return element;
}
function replaceAnnotations(){
    for(let i = 0;i<annotationObj.length;i++){
        const InputHolder = `<p>${annotationObj[i].label}</p><input onchange="showAnnotations()"  class="form-input-box" id="${annotationObj[i].label}" placeholder="Data Target"><input class="form-input-box" onchange="showAnnotations()" id="${annotationObj[i].label + '-orbit'}" placeholder="Data Orbit"><textarea id="${annotationObj[i].label + '-info'}" width="100%;height:350px;">`;
        const Node = createElement(InputHolder);
        document.getElementById('data-input').appendChild(Node)
    }
    for(let i=0;i<annotationObj.length;i++){
        if(annotationObj[i].dataset.dataTarget)
            document.getElementById(annotationObj[i].label).value = annotationObj[i].dataset.dataTarget;
        if(annotationObj[i].dataset.dataOrbit)
            document.getElementById(annotationObj[i].label+"-orbit").value = annotationObj[i].dataset.dataOrbit;
        if(annotationObj[i].dataset.dataInfo)
            document.getElementById(annotationObj[i].label+"-info").value = annotationObj[i].dataset.dataInfo;
        
    }
    showAnnotations()
}
function convertToObj(){
    let annotations = []
    for(let item in annotationObj){
        const dataset = {...annotationObj[item],dataset:{...annotationObj[item].dataset}}
        annotations.push(dataset)
    }
    return annotations;
}
function update(){
    console.log("click")
    const modelName = document.getElementById("name").value;
    const modelStreetView = document.getElementById('street-view').value;
    if(!modelName){
        alert("These are required fields")
        return;
    }
    for(let i=0;i<annotationObj.length;i++){
        const dataTarget = document.getElementById(annotationObj[i].label).value;
        const dataOrbit = document.getElementById(annotationObj[i].label+"-orbit").value;
        const dataInfo = document.getElementById(annotationObj[i].label+"-info").value;
        
        if(!dataTarget || !dataOrbit){
            alert("Enter these values")
            return;
        }
        annotationObj[i].dataset.dataTarget = dataTarget
        annotationObj[i].dataset.dataOrbit = dataOrbit;
        annotationObj[i].dataset.dataInfo = dataInfo;
    }
    const finalObject = {
        name:modelName,
        streetViewUrl:modelStreetView,
        annotation:convertToObj(),
        images:images
    }
    const value = document.getElementById('models-list').value;
    updateDocument("Models",value,finalObject)
}
function getAnnotations(){
    const element = createHtmlTag()
    const annotations = element.querySelectorAll('.Hotspot')
    console.log(annotations)
    const labels = element.querySelectorAll('.HotspotAnnotation')
    for(let i = 0;i < annotations.length;i++)
        annotationObj.push({
            dataset: annotations[i].dataset,
            label:labels[i].outerText
        })
    
    replaceAnnotations();
}
function showAnnotations(){
    
    let str = "";
    for(let i in annotationObj){
        const dataTarget = document.getElementById(annotationObj[i].label).value;
        const dataOrbit = document.getElementById(annotationObj[i].label+"-orbit").value;
        str += 
        `<button
        class="Hotspot" 
        slot="hotspot-${i+1}" 
        data-position="${annotationObj[i].dataset.position}" 
        data-normal="${annotationObj[i].dataset.normal}"
        data-orbit="${dataOrbit}"
        data-target="${dataTarget}"
        data-visibility-attribute="visible">
        <div class="HotspotAnnotation">${annotationObj[i].label}</div>
        </button>
        `
    }
    document.getElementById('viewer').innerHTML = str;
    startAnnotationListerner();
}

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
function startAnnotationListerner(){
    const modelViewer1 = document.querySelector("#viewer");
    const annotationClicked = (annotation) => {
        let dataset = annotation.dataset;
        modelViewer1.cameraTarget = dataset.target;
        modelViewer1.cameraOrbit = dataset.orbit;
        modelViewer1.fieldOfView = '45deg';
    }

    modelViewer1.querySelectorAll('button').forEach((hotspot) => {
    hotspot.addEventListener('click', () => annotationClicked(hotspot));
  });
}
function getModels(){
    const category = "Monuments";
    getModelsByCategory(category,(documents)=>{
        documents.forEach(doc=>{
            document.getElementById('models-list').innerHTML += `<option value="${doc.data().uid}">${doc.data().name}</option>`
        })
    });
}
function getSelectedModel(){
    const value = document.getElementById('models-list').value;
    fetchSelectedDocument('Models',value,(doc)=>{
        document.getElementById('viewer').src = doc.url;
        document.getElementById('name').value = doc.name;
        images=doc.images
        annotationObj = doc.annotation || []
        replaceImageList(images);
        document.getElementById('street-view').value = doc.streetView;
        replaceAnnotations()
    })
}
getModels();
document.getElementById('update-model-form').addEventListener('submit',(event)=>{
    event.preventDefault()
})