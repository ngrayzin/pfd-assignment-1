// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
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
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      inputField.reset();
    });
})

if(PATHNAME == "donation.html"){
    var pname = document.getElementById("productname");
    const ploc =  document.getElementById("location");
    const pcond = document.getElementById("condition");
    var desc = document.getElementById("desc");
    const image = document.getElementById("img");
    const submit = document.getElementById("psub");
    var files= [];
    submit.addEventListener("click", (e)=> {
      var user = auth.currentUser;
      var nname = pname.value;
      var ddesc = desc.value;
      var loctext = ploc.options[ploc.selectedIndex].text;
      var context = pcond.options[pcond.selectedIndex].text;
      var img = image.value;
      /*files = e.target.files;
      reader = new FileReader();
      reader.onload = function(){
        document.getElementById("img").src = reader.result;
      }
      reader.readAsDataURL(files[0]);*/
      const storageRef = ref_storage(storage, user.uid + nname + "img");
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      writeProductData(nname, user, loctext, context, ddesc, user.uid + nname)
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

/*function checkIfLogin(e) {
  var user = auth.currentUser;
  if(user){
    //do nothing
  }
  else{
    e.preventDefault();
    //window.location.href = "/index.html";
    myModal.show();
  }
}*/



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
