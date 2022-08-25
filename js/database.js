const firebaseConfig = {
    apiKey: "AIzaSyC1T1cc8WBitrp5Y-t2rb-7dbaMbPbh7JQ",
    authDomain: "arlearn-3f847.firebaseapp.com",
    projectId: "arlearn-3f847",
    storageBucket: "arlearn-3f847.appspot.com",
    messagingSenderId: "1090047578408",
    appId: "1:1090047578408:web:d6d0ba7649029912f8401d"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

function addDataToDatabase(docs){
    db.collection("Models").add(docs)
    .then((ref) => {
        db.collection("ModelCategory").add({
            type:'Monuments',
            name:docs.name,
            uid:ref.id
        }).then(()=>console.log("Data written successfully"))
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
function progress(snapshot) {
    const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    const progressBar = document.getElementById("progress")
    progressBar.style.display = 'block';
    progressBar.value = percentage;
    
}
async function getDownloadUrl(filename){
    const url = await firebase.storage().ref(filename).getDownloadURL()
    return url;
}
function uploadFileToStorage(file){
    uploadedFile = file.name;
    const storage = firebase.storage().ref(file.name);
    const upload = storage.put(file);
    upload.on("state_changed",progress,(err)=>console.log("error ",err),onComplete);
}
function getModelsByCategory(category,onDataFetchComplete){
    db.collection("ModelCategory").where("type", "==", category)
    .get()
    .then((querySnapshot) => {
        onDataFetchComplete(querySnapshot)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}
function fetchSelectedDocument(collection,id,onFetchComplete){
    db.collection(collection).doc(id).get().then((doc)=>{
        onFetchComplete(doc.data())
    }).catch(err=>console.log(err))
}
function updateDocument(collection,id,updatedDocs){
    db.collection(collection).doc(id).update(updatedDocs).then(()=>{
        console.log("updated Successfully")
    }).catch(err=>console.log("somehing went wrong",err))
}
function addQuestion(ques){
    db.collection('questions').add(ques).then((res)=>addAnswer(res.id)).catch((err)=>{
        console.log(err)
    })
}
function addAnswer(id){
    const answer = document.getElementById('correct_answer').value;
    db.collection('answers').doc(id).set({value:answer}).then(res=>console.log("added")).catch(err=>console.log(err))
}

function fetchQuestions(age,monument){
    console.log("Screen")
    db.collection("questions").where('age','==',age).where('monument','==',monument).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}
function matchAnswer(question,answer){
    db.collection('answers').doc(question.id).get().then(res=>console.log(res.data()));
}