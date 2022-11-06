// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref as ref_database, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getStorage, ref as ref_storage, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
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
const storage = getStorage();

let PATHNAME = "";
let x = window.location.pathname.split("/");
PATHNAME = x[1]

console.log(PATHNAME);


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  var notLoggedIn = document.getElementById("notLoggedIn");
  var loggedIn = document.getElementById("Nameholder");
  var btn = document.getElementById("btn");
  var donate = document.getElementById("dtn");
  var home = document.getElementById("hme");
  var requestBtn = document.querySelectorAll("#requestBtn");
  var toast = document.getElementsByClassName("toast");
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
    for(let i = 0; i < requestBtn.length; i++){
      requestBtn[i].addEventListener("click", function() {
        $('.toast').toast('show');
      });
    };
    if(PATHNAME == "index.html"){
      location.href = "userIndex.html";
    }
    home.href = "userIndex.html"
    donate.href = "donation.html"
    returnName();
  } else {
    home.href = "index.html"
    loggedIn.style.display = "none"
    btn.innerText = "Login"
    btn.addEventListener("click", () => {
      myModal.show();
    });
    donate.addEventListener("click", () => {
      myModal.show();
    });
    for (let i = 0; i < requestBtn.length; i++) {
      requestBtn[i].addEventListener("click", function() {
        myModal.show();
      });
  }
    if(PATHNAME == "donation.html" || PATHNAME == "userIndex.html"){
      location.href = "index.html";
    }
  }
});

var button1 = document.getElementById("loginbutton");
var button2 = document.getElementById("signupbutton");
var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));

button1.addEventListener("click", (e) => {
  e.preventDefault();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var errormsg = document.getElementsByClassName("errormsg")
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      inputField.reset();
      myModal.hide();
      location.href = "userIndex.html";
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      inputField.reset();
    });

})

button2.addEventListener("click", (e) => {
  e.preventDefault();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var name = document.getElementById("name").value
  var errormsg = document.getElementsByClassName("errormsg")
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      writeUserData(user.uid, name, email)
      inputField.reset();
      myModal.hide();
      location.href = "userIndex.html";
    })
    .catch((error) => {
      localStorage.clear();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      inputField.reset();
    });
})


if(PATHNAME == "donation.html"){
  const inputFieldp = document.getElementById("donateForm");
  const submit = document.getElementById("psub");
  submit.addEventListener("click", (e)=> {
    e.preventDefault();
    var user = auth.currentUser;
    var nname = document.getElementById("productname").value;
    var ddesc = document.getElementById("desc").value;
    var loctext = document.getElementById("location").options[document.getElementById("location").selectedIndex].text;
    var context = document.getElementById("condition").options[document.getElementById("condition").selectedIndex].text;
    var img = document.getElementById("image").files[0];
    var imgname = ""; 
    //console.log(img.name);
    if(img){
      imgname = img.name;
      const storageRef = ref_storage(storage, img.name);
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
    }
    //not working :((((((((((((()))))))))))))
    /*storageRef.getDownloadURL().then(function(url) {
      writeProductData(nname, user, loctext, context, ddesc, url)
    });*/
    writeProductData(nname, user, loctext, context, ddesc, imgname);
    $('.p').toast('show');
    inputFieldp.reset();
  })
}

// Save message to firebase
function writeUserData(userId, name, email) {
  set(ref_database(db, 'users/' + userId), {
    username: name,
    email: email,
  });
}

function writeProductData(name, user, location, condition, desc, img){
  set(ref_database(db, 'product/' + user.uid + name), {
    product_name: name,
    posted_by: user.uid,
    location : location,
    condition: condition,
    description: desc,
    image: img,
    claimed : false,
  });
}


//return user name
function returnName() {
  const userId = auth.currentUser.uid;
  return onValue(ref_database(db, '/users/' + userId), (snapshot) => {
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
