// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
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

const db = getDatabase();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  var notLoggedIn = document.getElementById("notLoggedIn");
  var loggedIn = document.getElementById("Nameholder");
  var btn = document.getElementById("btn");
  var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    loggedIn.style.display = "block"
    btn.innerText = "Log out"
    btn.addEventListener("click", () => {
      signOut(auth).then(() => {
        // Sign-out successful.
        myModal.hide();
      }).catch((error) => {
        // An error happened.
      });
    })
    //window.location = '/userIndex.html';
    //notLoggedIn.style.display = "none"
    returnName();
  } else {
    loggedIn.style.display = "none"
    btn.innerText = "Login"
    btn.addEventListener("click", () => {
      myModal.show();
    })
  }
});

var button1 = document.getElementById("loginbutton");
var button2 = document.getElementById("signupbutton");
var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));

button1.addEventListener("click", (e) => {
  e.preventDefault();
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
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });

})

button2.addEventListener("click", (e) => {
  e.preventDefault();
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var name = document.getElementById("name").value
  var errormsg = document.getElementsByClassName("errormsg")
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var test = document.getElementById("test")
      const user = userCredential.user;
      writeUserData(user.uid, name, email);
      const inputField = document.getElementById("form");
      inputField.reset();
      myModal.hide();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
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

//return user name
function returnName() {
  const userId = auth.currentUser.uid;
  return onValue(ref(db, '/users/' + userId), (snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    document.getElementById("Nameholder").innerText = username;
  }, {
    onlyOnce: true
  });
}



let toggle = document.getElementById("toggle");
let signup = document.getElementById("signup");
let loginbutton = document.getElementById("login");
let change1 = document.getElementById("change1");
let change2 = document.getElementById("change2");

signup.style.display = "none";

toggle.addEventListener("click", () => {
  if (signup.style.display === "none") {
    signup.style.display = "block"
    loginbutton.style.display = "none"
    change1.innerText = "Already have an account? Click"
    change2.innerText = "login"
  }
  else {
    signup.style.display = "none"
    loginbutton.style.display = "block"
    change1.innerText = "Don't have an account? Click"
    change2.innerText = "sign up"
  }

})
