// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged,  signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.12.0/firebase-auth.js";
import { getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.12.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy8mK2iT0vI5Iqz-KOZhJ9zU3bge2Pvq8",
  authDomain: "pfd-assignment1.firebaseapp.com",
  databaseURL: "https://pfd-assignment1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pfd-assignment1",
  storageBucket: "pfd-assignment1.appspot.com",
  messagingSenderId: "133665479442",
  appId: "1:133665479442:web:babfd33667f90e95c4b1cb",
  measurementId: "G-36TTBLFNYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase();

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    var notLoggedIn = document.getElementById("notLoggedIn");
    var loggedIn = document.getElementById("loggedIn");
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    loggedIn.style.display = "block"
    notLoggedIn.style.display = "none"
  } else {
    loggedIn.style.display = "none"
    notLoggedIn.style.display = "block"
  }
});

var button1 = document.getElementById("loginbutton");
var button2 = document.getElementById("signupbutton");
var button3 = document.getElementById("logout");
var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));

button1.addEventListener("click", (e)=>{
    var email = document.getElementById("exampleInputEmail1").value
    var password = document.getElementById("exampleInputPassword1").value
    var errormsg = document.getElementsByClassName("errormsg")
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const inputField = document.getElementById("form");
        inputField.reset();
        myModal.hide();
        //var nameholder = document.getElementById("Nameholder");
        //nameholder.innerText = `${user.name}`
        
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    });

})

button2.addEventListener("click", ()=>{
    var email = document.getElementById("exampleInputEmail1").value
    var password = document.getElementById("exampleInputPassword1").value
    var name = document.getElementById("name").value
    var errormsg = document.getElementsByClassName("errormsg")
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    writeUserData(user.uid,name,email);
    const inputField = document.getElementById("form");
    inputField.reset();
    myModal.hide();
    //var nameholder = document.getElementById("Nameholder");
    //nameholder.innerText = `${name}`
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
})

button3.addEventListener("click", ()=>{
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
})

// Save message to firebase
function writeUserData(userId, name, email) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
    });
  }



let toggle = document.getElementById("toggle");
let signup = document.getElementById("signup");
let loginbutton = document.getElementById("login");
let change1 = document.getElementById("change1");
let change2 = document.getElementById("change2");

signup.style.display = "none";

toggle.addEventListener("click", ()=>{
    if(signup.style.display === "none"){
        signup.style.display = "block"
        loginbutton.style.display = "none"
        change1.innerText = "Already have an account? Click"
        change2.innerText = "login"
    }
    else{
        signup.style.display = "none"
        loginbutton.style.display = "block"
        change1.innerText = "Don't have an account? Click"
        change2.innerText = "sign up"
    }
      
})
