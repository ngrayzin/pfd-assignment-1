// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, browserSessionPersistence, setPersistence, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref as ref_database, set, onValue, get, child, push, update, runTransaction , query, orderByChild} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getStorage, ref as ref_storage, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging.js";

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
const provider = new GoogleAuthProvider();

let PATHNAME = "";
let FIRSTPATHNAME = "";
let x = window.location.pathname.split("/").pop();
PATHNAME = x
FIRSTPATHNAME = window.location.pathname.split("/");


console.log(PATHNAME);
console.log(FIRSTPATHNAME);


const auth = getAuth();

const dbRef = ref_database(getDatabase());
var dic = {};
var names = {};
get(child(dbRef, "users")).then((snapshot) => {
  snapshot.forEach(function (_child) {
    dic[_child.key] = _child.val().picture;
    names[_child.key] = _child.val().username;
  })
}), {
  onlyOnce: true
};

onAuthStateChanged(auth, (user) => {
  var notLoggedIn = document.getElementById("notLoggedIn");
  //var loggedIn = document.getElementById("Nameholder");
  var btn = document.getElementById("btn");
  var donate = document.getElementById("dtn");
  var home = document.getElementById("hme");
  var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const pic = user.photoURL;
    localStorage.setItem("uid", uid);
    localStorage.setItem("pic", pic);
    //loggedIn.style.display = "block"
    btn.innerText = "Log out"
    btn.addEventListener("click", () => {
      signOut(auth).then(() => {
        localStorage.clear();
        myModal.hide();
      }).catch((error) => {
        // An error happened.
      });
    })
    /*if(PATHNAME == "index.html"){
      location.href = "userIndex.html";
    }*/
    home.href = "userIndex.html"
    donate.href = "donation.html"
    returnName();
  } else {
    home.href = "index.html"
    //loggedIn.style.display = "none"
    btn.innerText = "Login"
    btn.addEventListener("click", () => {
      myModal.show();
    });
    donate.addEventListener("click", () => {
      myModal.show();
    });
    if (PATHNAME == "donation.html" || PATHNAME == "userIndex.html") {
      location.href = "index.html";
    }
  }
});

var button1 = document.getElementById("loginbutton");
var button2 = document.getElementById("signupbutton");
var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
var googleBtn = document.getElementById("googleLogin");

button1.addEventListener("click", (e) => {
  e.preventDefault();
  $('#overlay').fadeIn();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var errormsg = document.getElementsByClassName("errormsg")
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          $('#overlay').fadeOut();
          inputField.reset();
          myModal.hide();
          location.href = "userIndex.html";
        })

        .catch((error) => {
          $('#overlay').fadeOut();
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          inputField.reset();
        });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });

})

button2.addEventListener("click", (e) => {
  e.preventDefault();
  $('#overlay').fadeIn();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var name = document.getElementById("name").value
  var errormsg = document.getElementsByClassName("errormsg")
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          writeUserData(user.uid, name, email);
          inputField.reset();
        })
        .catch((error) => {
          localStorage.clear();
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          $('#overlay').fadeOut();
          inputField.reset();
        });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(errorMessage);
    });
})
/*
googleBtn.addEventListener("click", (e) => {
  e.preventDefault
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      writeUserData(user.uid, user.displayName, user.email)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
})
*/


if (PATHNAME == "donation.html") {
  const inputFieldp = document.getElementById("donateForm");
  const submit = document.getElementById("psub");
  const breadcrumb = document.getElementById("breadcrumb");
  submit.addEventListener("click", (e) => {
    e.preventDefault();
    $('#overlay').fadeIn();
    var done = false;
    var user = auth.currentUser;
    var nname = document.getElementById("productname").value;
    var ddesc = document.getElementById("desc").value;
    var loctext = document.getElementById("location").options[document.getElementById("location").selectedIndex].text;
    var context = document.getElementById("condition").options[document.getElementById("condition").selectedIndex].text;
    var img = document.getElementById("image").files[0];
    var imgname = "";
    //console.log(img.name);
    if (img) {
      imgname = img.name;
      const storageRef = ref_storage(storage, img.name);
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(storageRef, img).then(function (url) {
          if (url) {
            writeProductData(nname, user, loctext, context, ddesc, url)
          }
          else {
            writeProductData(nname, user, loctext, context, ddesc, imgname)
          }
        });
      });
    }
    else {
      writeProductData(nname, user, loctext, context, ddesc, imgname)
    }
    inputFieldp.reset();
  })
}


if (PATHNAME == "store.html") {
  const urlParams = new URLSearchParams(window.location.search);
  const deleteSuccess = urlParams.get('deleteSuccess');
  if (deleteSuccess === '1') {
    // The page was just reloaded, display the toast:
    //console.log($('.toast').toast('show'))
    $(document).ready(function () {
      $('.toast').toast('show');
    });
  }
  //
  readProductData();
}

if (PATHNAME == "viewproduct.html") {
  var requestBtn = document.getElementById("requestBtn");
  var chatBtn = document.getElementById("chatBtn");
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const list = JSON.parse(localStorage.getItem('list'));
  for (let i = 0; i < list.length; i++) {
      var item = list[i][0];
      if (item == product) {
        $("#pdname").text(list[i][1]);
        $("#pddesc").text(list[i][2]);
        $("#pdimg").attr("src", list[i][3]);
        $("#pdloc").text("meet-up: " + list[i][4]);
        $("#pdcon").text("condition: " + list[i][5]);
        returnUser(list[i][6]);
        requestBtn.addEventListener("click", function(){ change(product,list[i][6]); });
        chatBtn.addEventListener("click", function(){ localStorage.setItem("msging", list[i][6]);});
      }
  }
}

if (PATHNAME == "userIndex.html") {
  var data = []
  var scores = document.getElementById("score");
  var exp = document.getElementById("XP");
  var userLevel = document.getElementById("userLevel");
  var lvl5 = document.getElementById("5");
  var lvl15 = document.getElementById("15");
  var lvl30 = document.getElementById("30");
  const userId = localStorage.getItem("uid");
  const pic = localStorage.getItem("pic");
  const dbRef = ref_database(getDatabase());
  var donateOnce = document.getElementById("donateOnce");
  var donate5 = document.getElementById("donate5");
  var claimOnce = document.getElementById("claimOnce");
  var claim5 = document.getElementById("claim5");
  var request1 = document.getElementById("r1");
  var request5 = document.getElementById("r5");
  var first = document.getElementById("1st");
  var second = document.getElementById("2nd");
  var thrid = document.getElementById("3rd");
  var userImg = document.getElementById("userImg");
  var achiv = document.getElementById("achieved");
  var achiv1 = document.getElementById("achieved1");
  var barbar = document.getElementById("progress-bar-currnt-achiv");
  var achieved = 0;
  console.log(pic);
  get(child(dbRef, "users/" + userId)).then((snapshot) => {
    if (snapshot.exists()) {
      var s = snapshot.val().score;
      var xp = snapshot.val().currentExp;
      var lvl = snapshot.val().level;
      var picture = snapshot.val().picture;
      if(pic != "null"){
        if(picture == null){
          userImg.src = pic
          const updatePic = {};
          updatePic['/users/' + userId + '/picture'] = pic;
          update(ref_database(db), updatePic);
        }
        else{
          if(picture != null){
            userImg.src = picture;
          }else{
            userImg.src = "images/default.jpg"
          }
        }
      }
      else if(pic == "null"){
        if(picture != null){
          userImg.src = picture;
        }else{
          userImg.src = "images/default.jpg"
        }
      }
      scores.innerText = s;
      data = progressBar(xp, lvl);
      var achievements = snapshot.val().achievement;
      exp.innerText = data[1] + "/" + data[2];
      userLevel.innerText = "Level " + data[0];
      if(lvl >= 5){
        lvl5.classList.remove("not-achieved");
        achieved++;
      }
      if(lvl >= 15){
        lvl15.classList.remove("not-achieved");
        achieved++
      }
      if(lvl >= 30){
        lvl30.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.r1 != null){
        request1.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.r5 != null){
        request5.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.c1 != null){
        claimOnce.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.c5 != null){
        claim5.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.p1 != null){
        donateOnce.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.p5 != null){
        donate5.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.first != null){
        first.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.second != null){
        second.classList.remove("not-achieved");
        achieved++;
      }
      if(achievements.thrid != null){
        thrid.classList.remove("not-achieved");
        achieved++;
      }
      if(snapshot.val().cancelled != null){
        alert("Your request for "+ snapshot.val().cancelled + " had been cancelled by the poster");
        const notify = {};
        notify['/users/' + userId + '/cancelled'] = null;
        update(ref_database(db), notify)
      }
      achiv.innerText = achieved;
      achiv1.innerText = achieved + "/12";
      barbar.style.width = (achieved / 12 * 100) + "%";
    }
  });
  displayProductByUser(userId);
  calculatePoints(userId);
  changePic(userId);
}

function progressBar(currentExp, lvl) {
  var data = [];
  var userId = auth.currentUser.uid;
  var XP = document.getElementsByClassName("progress-bar")[0]
  var total;
  if (lvl >= 0 || lvl <= 10) {
    total = 100;
  }
  else if (lvl >= 11 || lvl <= 20) {
    total = 200;
  }
  else if (lvl >= 21 || lvl <= 30) {
    total = 300;
  }
  else if (lvl >= 31 || lvl <= 40) {
    total = 400;
  }
  else {
    total = 500;
  }
  console.log(total);
  console.log(currentExp);
  if (currentExp >= total) {
    lvl++;
    currentExp = currentExp - total;
    var startListening = function () {
      const updates = {};
      updates[`/users/${userId}/currentExp`] = currentExp;
      updates[`/users/${userId}/level`] = lvl;
      update(ref_database(db), updates).then(() => {
        XP.style.width = (currentExp / total * 100) + "%";
        alert("level up!");
      })
    }
    data.push(lvl);
    data.push(currentExp);
    data.push(total);
    startListening();
    return data;
  } else {
    XP.style.width = (currentExp / total * 100) + "%";
    data.push(lvl);
    data.push(currentExp);
    data.push(total);
    return data;
  }
}

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});

function changePic(uid){
  var press = document.getElementById("changeMe");
  var press1 = document.getElementById("imgupload");
  var imgname = "";
  press.addEventListener("click", () => {
    $('#imgupload').trigger('click')
    press1.addEventListener("change", function(){
      var file = press1.files[0];
      $('#overlay').fadeIn();
      if (file) {
        imgname = file.name;
        console.log(imgname);
        const storageRef = ref_storage(storage, file.name);
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!');
          getDownloadURL(storageRef, file).then(function (url) {
            if (url) {
              const updatePic = {};
              updatePic['/users/' + uid + '/picture'] = url;
              update(ref_database(db), updatePic).then(()=>{
                location.reload();
              })
            }
            else {
              alert("upload failed");
              $('#overlay').fadeOut();
            }
          });
        });
      }
      else {
        alert("upload failed");
        $('#overlay').fadeOut();
      }
    });
  })
}

window.search = search;
function search() {
  var input, filter, div, divCard, a, b, i, txtValue;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  div = document.getElementById("storeCards");
  divCard = div.getElementsByClassName("card-full");
  for (i = 0; i < divCard.length; i++) {
    a = divCard[i].getElementsByTagName("b")[0];
    //b = divCard[i].getElementsByTagName("p")[0];
    console.log(a);
    txtValue = a.textContent || a.innerText; //|| b.textContent || b.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      divCard[i].style.display = "";
    } else {
      divCard[i].style.display = "none";
    }
  }

}

if (PATHNAME == "leaderboard.html") {
  loadLeaderboard();
}


function loadLeaderboard() {
  var leaderboard = document.getElementById("leaderboard");
  const dbRef = ref_database(getDatabase());
  var users = [];
  var dic = {};
  get(child(dbRef, "users")).then((snapshot) => {
    snapshot.forEach(function (_child) {
      users.push(_child.val());
      dic[_child.val().username] = _child.key
    });
  }).then(()=>{
    var place = 1;
    users.sort((a, b) => (a.score < b.score) ? 1 : -1)
    users.forEach(user => {
      var img = user.picture;
      if(img == null){
        img = "images/default.jpg"
      }
      if(place == 1){
        const updates = {};
        updates[`/users/${dic[user.username]}/achievement/first`] = true
        update(ref_database(db), updates)
        var carbon = (user.score/1000)*200;
        leaderboard.innerHTML += 
        `
        <tr>
          <th scope="row"><span class="badge first mt-1">1</span></th>
          <td><p class="pt-1"><img src="${img}" alt="" width="30" height="30" class="rounded-circle me-3"> ${user.username}</p></td>
          <td><p class="pt-1">${user.score}</p></td>
          <td><p class="pt-1">${Math.ceil(carbon)}g</p></td>
        </tr>
        `
      }
      else if(place == 2){
        const updates = {};
        updates[`/users/${dic[user.username]}/achievement/second`] = true
        update(ref_database(db), updates)
        var carbon = (user.score/1000)*200;
        leaderboard.innerHTML += 
        `
        <tr>
          <th scope="row"><span class="badge second mt-1">2</span></th>
          <td><p class="pt-1"><img src="${img}" alt="" width="30" height="30" class="rounded-circle me-3"> ${user.username}</p></td>
          <td><p class="pt-1">${user.score}</p></td>
          <td><p class="pt-1">${Math.ceil(carbon)}g</p></td>
        </tr>
        `
      }
      else if(place == 3){
        const updates = {};
        updates[`/users/${dic[user.username]}/achievement/thrid`] = true
        update(ref_database(db), updates)
        var carbon = (user.score/1000)*200;
        leaderboard.innerHTML += 
        `
        <tr>
        <th scope="row"><span class="badge thrid mt-1">3</span></th>
          <td><p class="pt-1"><img src="${img}" alt="" width="30" height="30" class="rounded-circle me-3"> ${user.username}</p></td>
          <td><p class="pt-1">${user.score}</p></td>
          <td><p class="pt-1">${Math.ceil(carbon)}g</p></td>
        </tr>
        `
      }
      else{
        var carbon = (user.score/1000)*200;
        leaderboard.innerHTML += 
        `
        <tr>
          <th scope="row"><span class="badge place mt-1">${place}</span></th>
          <td><p class="pt-1"><img src="${img}" alt="" width="30" height="30" class="rounded-circle me-3"> ${user.username}</p></td>
          <td><p class="pt-1">${user.score}</p></td>
          <td><p class="pt-1">${Math.ceil(carbon)}g</p></td>
        </tr>
        `
      }
      place++;
    });
  })
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// Save message to firebase
function writeUserData(userId, name, email) {
  const dbRef = ref_database(getDatabase());
  get(child(dbRef, "users/" + userId)).then((snapshot) => {
    if (!snapshot.exists()) {
      set(ref_database(db, 'users/' + userId), {
        username: name,
        email: email,
        currentExp: 0,
        level: 0,
        score: 0,
      }).then(() => {
        $('#overlay').fadeOut();
        myModal.hide();
        location.href = "userIndex.html";
      }).catch((error) => {
        console.error(error);
      });
    }
    else {
      $('#overlay').fadeOut();
      myModal.hide();
      location.href = "userIndex.html";
    }

  });
}

function writeProductData(name, user, location, condition, desc, img) {
  const newPostKey = push(child(ref_database(db), 'product')).key;
  set(ref_database(db, 'product/' + newPostKey), {
    product_name: name,
    posted_by: user.uid,
    location: location,
    condition: condition,
    description: desc,
    image: img,
    claimed: false,
    requested: false,
    requested_by: "",
  }).then(() => {
    var userId = auth.currentUser.uid;
    const dbRef = ref_database(getDatabase());
    get(child(dbRef, "users/" + userId)).then((snapshot) => {
      if (snapshot.exists()) {
        var s = snapshot.val().score;
        var xp = snapshot.val().currentExp;
        const updates = {};
        updates[`/users/${userId}/currentExp`] = xp + 20;
        updates[`/users/${userId}/score`] = s + 100;
        update(ref_database(db), updates).then(() => {
          $('#overlay').fadeOut();
          $('.p').toast('show');
          return true;
        });
        // console.log(snapshot.val().score);
        // console.log(snapshot.val().level);
      }

    });
  });
}


function calculatePoints(uid) {
  var noOfVouchers = 0;
  var numberOfClaimed = 0
  var elem = document.getElementById("myBar");
  var vouch = document.getElementById("asdfgh");
  const dbRef = ref_database(getDatabase());
  get(child(dbRef, "product")).then((snapshot) => {
    snapshot.forEach(function (_child) {
      if (_child.val().posted_by == uid) {
        var key = _child.key;
        //childkeys.push([key,_child.val().product_name,_child.val().description]);
        //console.log(key);
        if (_child.val().claimed == true) {
          numberOfClaimed = numberOfClaimed + 1;
        }
      }
    })
    if (numberOfClaimed > 0) {
      //i = 1;
      var width = 0

      if (numberOfClaimed > 4) {
        while (numberOfClaimed >= 5) {
          noOfVouchers = noOfVouchers + 1;
          numberOfClaimed = numberOfClaimed - 4;
        }
        width = numberOfClaimed * 25;
      }
      else {
        width = numberOfClaimed * 25;
        if (width == 100) {
          noOfVouchers += 1;
        }
      }
      //var id = setInterval(frame, 10);
      /*function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
          elem.innerHTML = width + "%";
        }
      }*/
      //elem.style.width = width + "%";
      //elem.innerHTML = width + "%";
      console.log(noOfVouchers);
      console.log(numberOfClaimed);
    }
    //vouch.innerHTML = "Number of vouchers that can be claimed: " + noOfVouchers;
  })
}

var products = [];
window.change = change;
function readProductData() {
  //var childkeys = []
  var productExists = false;
  var storeItems = document.getElementById("storeCards");
  get(child(dbRef, "product")).then((snapshot) => {
    snapshot.forEach(function (_child) {
      if (_child.val().requested == false && _child.val().claimed == false) {
        var key = _child.key;
        var img = dic[_child.val().posted_by]
        if(img == null){
          img = "images/default.jpg";
        }
        products.push([key, _child.val().product_name, _child.val().description, _child.val().image, _child.val().location, _child.val().condition, _child.val().posted_by])
        var html = `
        <div class="card-full">
          <div class="card cardhover">
            <div class="card-header">
    
            </div>
            <div class="card-body">
              <div class="row justify-content-between">
                <div class="col-2">
                  <img src="${img}" alt="" width="42" height="42" class="rounded-circle">
                </div>
                <div class="col-3">
                  <a onClick="change('${key}', '${_child.val().posted_by}')"><img src="images/request.png" id="requestBtn" height ="42" width="42"/></a>
                </div>
              </div>
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <a href="viewproduct.html?product=${key}"><img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px; cursor: pointer;"></a> 
            </div>
          </div>
        </div>
        `
        storeItems.innerHTML += html;
        productExists = true;
      }
    })
    //console.log(products);
    localStorage.setItem("list", JSON.stringify(products));
    if (productExists == false) {
      var empty = `<div style="text-align: center;">
                    <img src="images/SPOILER_unknown.png" height="200px" width="auto">
                    <h5>Wow how empty...</h5>
                  </div>`
      storeItems.innerHTML += empty;
    }
  }).catch((error) => {
    console.error(error);
  });
}

window.claimProduct = claimProduct;
function claimProduct(key, requesterUid) {
  const claimBtn = document.getElementById("claimBtn");
  claimBtn.addEventListener("click", () => {
    var userId = auth.currentUser.uid;
    const dbRef = ref_database(getDatabase())
    const updates = {};
    if(userId == requesterUid){
      updates['/product/' + key + '/collected/'] = true;
      //updates['/product/' + key + '/requested_by/'] = "";
      get(child(dbRef, "users/" + userId)).then((snapshot) => {
        if (snapshot.exists()) {
          var s = snapshot.val().score;
          var xp = snapshot.val().currentExp;
          updates[`/users/${userId}/currentExp`] = xp + 40;
          updates[`/users/${userId}/score`] = s + 300;
          update(ref_database(db), updates).then(() => {
            location.reload();
          });
        }
      });
    }
    else{
      updates['/product/' + key + '/claimed/'] = true;
      //updates['/product/' + key + '/requested_by/'] = "";
      get(child(dbRef, "users/" + userId)).then((snapshot) => {
        if (snapshot.exists()) {
          var s = snapshot.val().score;
          var xp = snapshot.val().currentExp;
          updates[`/users/${userId}/currentExp`] = xp + 40;
          updates[`/users/${userId}/score`] = s + 300;
          update(ref_database(db), updates).then(() => {
            location.reload();
          });
        }
      });
    }
  })
}

window.modal = modal;
function displayProductByUser(uid) {
  //console.log(uid);
  var productExist = false;
  var requestExist = false;
  var requestedExist = false;
  const storeItems = document.getElementById("productList");
  const requesters = document.getElementById("requests");
  const r = document.getElementById("requested");
  const requestCount = document.getElementById("requestCount"); 
  const requesterCount = document.getElementById("requesterCount");
  const productCount = document.querySelectorAll("[id='productPosted']");
  const productClaimed = document.getElementById("productClaimed");
  let asd = document.getElementById("empty");
  const dbRef = ref_database(getDatabase());
  var request = 0;
  var posted = 0;
  var claimed = 0;
  var requester = 0;
  get(child(dbRef, "product")).then((snapshot) => {
    snapshot.forEach(function (_child) {
      if (_child.val().requested_by == uid && _child.val().collected == null) {
        console.log(_child.key + "Asda")
        var img = dic[_child.val().posted_by]
        if(img == null){
          img = "images/default.jpg";
        }
        var username = names[_child.val().posted_by];
        requester += 1;
        requestedExist = true;
        var requestedhtml = `
        <div class="alert alert-dark mt-3">
          <div class="row g-5 pt-1">
            <div class="col-md-2">
              <img src="${_child.val().image}" height="120px" width="auto" style="border-radius: 5px;">
            </div>
            <div class="col-md-3 d-grid gap-2 pb-5 me-2">
              <h5>${_child.val().product_name}</h5>
              <button class="btn btn-outline-warning disabled" style="background-color: #FCECD9 !important; color: black !important;">Pending Request</button>
            </div>
            <div class="col-md-3">
              <p>Posted by: </p>
              <p><img src="${img}" class="img-fluid rounded-circle me-3" style="width: auto;height:40px;border-radius: 100px;"/>${username}</p>
            </div>
            <div class="col-md-3 d-grid gap-2 pb-3">
              <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#claim" onclick="claimProduct('${_child.key}', '${_child.val().requested_by}')">Accept</button>
              <button type="button" class="btn btn-outline-primary btn-sm">Chat</button>
              <button type="button" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#cancel" onclick="cancelRequest('${_child.val().requested_by}','${_child.key}','${_child.val().product_name}')">Cancel</button>
            </div>
          </div>
        </div>
        `
        r.innerHTML += requestedhtml;
        requesterCount.innerHTML = requester;
      }
      else if (_child.val().posted_by == uid) {
        var img = dic[_child.val().posted_by]
        if(img == null){
          img = "images/default.jpg";
        }
        posted++;
        var key = _child.key;
        //childkeys.push([key,_child.val().product_name,_child.val().description]);
        //console.log(key);
        if (_child.val().claimed == true) {
          var img = dic[_child.val().posted_by]
          if(img == null){
            img = "images/default.jpg";
          }
          claimed++;
          var html = `
          <div class="card-full">
          <div class="card cardhover">
            <div class="card-header">
    
            </div>
            <div class="card-body">
              <div class="row justify-content-between">
                <div class="col-2">
                  <img src="${img}" alt="" width="42" height="42" class="rounded-circle">
                </div>
                <div class="col-3">
                  <img src="images/claim.png" height ="42" width="42"/>
                </div>
              </div>
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px;"> 
            </div>
          </div>
        </div>
          `
        }
        else if (_child.val().claimed == false && _child.val().requested == true) {
          var img = dic[_child.val().posted_by]
          if(img == null){
            img = "images/default.jpg";
          }
          var html = `
          <div class="card-full">
          <div class="card cardhover">
            <div class="card-header">
    
            </div>
            <div class="card-body">
              <div class="row justify-content-between">
                <div class="col-2">
                  <img src="${img}" alt="" width="42" height="42" class="rounded-circle">
                </div>
                <div class="col-3">
                  <img src="images/requested.png" height ="42" width="42"/>
                </div>
              </div>
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px;">
            </div>
          </div>
        </div>
          `
        }
        else {
          var img = dic[_child.val().posted_by]
          if(img == null){
            img = "images/default.jpg";
          }
          var html = `
        <div class="card-full">
          <div class="card cardhover">
            <div class="card-header">
    
            </div>
            <div class="card-body">
              <div class="row justify-content-between">
                <div class="col-2">
                  <img src="${img}" alt="" width="42" height="42" class="rounded-circle">
                </div>
                <div class="col-3">
                  <a onclick ="modal('${key}')" data-bs-toggle="modal" data-bs-target="#delete"><img src="images/delete.png" id="deleteBtn" height ="42" width="42" style="cursor: pointer;"/></a>
                </div>
              </div>
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px;">
            </div>
          </div>
        </div>
        `
        }
        //onClick="deleteRef('${key}'
        storeItems.innerHTML += html;
        productExist = true;
        if (_child.val().requested == true && _child.val().claimed == false) {
          var img = dic[_child.val().requested_by]
          if(img == null){
            img = "images/default.jpg";
          }
          asd.style.display = "none";
          onValue(ref_database(db, '/users/' + _child.val().requested_by), (snapshot) => {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            var rhtml = `
            <div class="alert alert-dark mt-3">
              <div class="row g-5 pt-1">
                <div class="col-md-2">
                  <img src="${_child.val().image}" height="120px" width="auto" style="border-radius: 5px;">
                </div>
                <div class="col-md-3 d-grid gap-2 pb-5 me-2">
                  <h5>${_child.val().product_name}</h5>
                  <button class="btn btn-outline-warning disabled" style="background-color: #FCECD9 !important; color: black !important;">Pending Request</button>
                </div>
                <div class="col-md-3">
                  <p>Requested by: </p>
                  <p><img src="${img}" class="img-fluid rounded-circle me-3" style="width: auto;height:40px;border-radius: 100px;"/>${username}</p>
                </div>
                <div class="col-md-3 d-grid gap-2 pb-3">
                  <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#claim" onclick="claimProduct('${_child.key}','${ _child.val().requested_by}')">Accept</button>
                  <button type="button" class="btn btn-outline-primary btn-sm">Chat</button>
                  <button type="button" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#cancel" onclick="cancelRequest('${_child.val().requested_by}','${_child.key}','${_child.val().product_name}')">Cancel</button>
                </div>
              </div>
            </div>
            `
            requesters.innerHTML += rhtml;
            request++;
            requestExist = true;
            requestCount.innerHTML = request;
            productClaimed.innerHTML = claimed;
          });
          //returnUser(_child.val().requested_by);
          //$("#rName").text(name);
        }
      }
    })
    if(posted >= 1){
      const p1 = {};
      p1['/users/' + uid + '/achievement/p1'] = true;
      update(ref_database(db), p1);
    }
    if(posted >= 5){
      const p5 = {};
      p5['/users/' + uid + '/achievement/p5'] = true;
      update(ref_database(db), p5);
    }
    if(claimed >= 1){
      const c1 = {};
      c1['/users/' + uid + '/achievement/c1'] = true;
      update(ref_database(db), c1);
    }
    if(claimed >= 5){
      const c5 = {};
      c5['/users/' + uid + '/achievement/c5'] = true;
      update(ref_database(db), c5);
    }
    if(requester >= 1){
      const r1 = {};
      r1['/users/' + uid + '/achievement/r1'] = true;
      update(ref_database(db), r1);
    }
    if(requester >= 5){
      const r5 = {};
      r5['/users/' + uid + '/achievement/r1'] = true;
      update(ref_database(db), r5);
    }
    for (var i = 0; i < productCount.length; i++) {
      productCount[i].innerHTML = posted; // <-- whatever you need to do here.
      //productCount.innerHTML = posted;
    }
    if (productExist == false) {
      var empty = `<div style="text-align: center;">
                    <img src="images/SPOILER_unknown.png" height="200px" width="auto">
                    <h5>Wow how empty...</h5>
                  </div>`
      storeItems.innerHTML += empty;
    }
    if (requestedExist == false) {
      var empty = `<div style="text-align: center;">
                    <img src="images/SPOILER_unknown.png" height="200px" width="auto">
                    <h5>Wow how empty...</h5>
                  </div>`
      r.innerHTML += empty;
    }
  }).catch((error) => {
    console.error(error);
  });
}

window.cancelRequest = cancelRequest;
function cancelRequest(userID, productID, product_name) {
  const cancelBtn = document.getElementById("cancelBtn");
  cancelBtn.addEventListener("click", () => {
    const updates = {};
    updates['/product/' + productID + '/requested'] = false;
    updates['/product/' + productID + '/requested_by'] = "";
    update(ref_database(db), updates)
      .then(() => {
        const notify = {};
        notify['/users/' + userID + '/cancelled'] = product_name;
        update(ref_database(db), notify).then(() => {
          location.reload();
        })
      })
  })
}


function modal(key) {
  //msg.show();
  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.addEventListener("click", () => {
    const updates = {};
    updates['/product/' + key] = null
    update(ref_database(db), updates);
    location.reload();
  })

}

function change(key, poster) {
  //console.log(key);
  //console.log(poster);
  var user = auth.currentUser;
  if (user) {
    var userId = auth.currentUser.uid;
    //const newPostKey = push(child(ref_database(db), 'product')).key;
    const updates = {};
    updates['/product/' + key + '/requested/'] = true;
    updates['/product/' + key + '/requested_by/'] = userId;
    if (poster == userId) {
      alert("cant claim your own product");
    }
    else {
      update(ref_database(db), updates).then(() => {
        // const achievements = {};
        // achievements[`/users/${userId}/requester`] += 1;
        // update(ref_database(db), achievements).then(() => {
        //   window.location.href = "store.html" + '?deleteSuccess=1';
        // });
        window.location.href = "store.html" + '?deleteSuccess=1';
      });
      //location.reload();
      /*$('.toast').toast('show');
      const url = new URL(window.location.href);
      url.searchParams.set('deleteSuccess', 1);
      //var newpath = "store.html" + '?deleteSuccess=1';
      //window.location.replace(newpath);*/
    }
  }
  else {
    myModal.show();
    return false
  }
}


//return user name
function returnName() {
  const userId = auth.currentUser.uid;
  return onValue(ref_database(db, '/users/' + userId), (snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    if (PATHNAME == "userIndex.html") {
      document.getElementById("pdusername").innerText = username; //"Welcome back " + username+"!👋";
    }
  }, {
    onlyOnce: true
  });
}


function returnUser(userKey) {
  return onValue(ref_database(db, '/users/' + userKey), (snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    var email = (snapshot.val() && snapshot.val().email) || 'Anonymous';
    //pduser
    $("#pduser").text("posted by: " + username);
  }, {
    onlyOnce: true
  });

}

if (PATHNAME == "index.html" || PATHNAME == "store.html" || PATHNAME == "") {
  window.onscroll = function () {
    const header_navbar = document.querySelector(".navbar");
    const sticky = header_navbar.offsetTop;
    const colour = document.querySelector(".fixed-top");

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add("bg-light");
      header_navbar.classList.add("shadow");
      header_navbar.classList.add("scrolled");
      header_navbar.classList.remove("navbar-custom");
    } else {
      //header_navbar.classList.remove("bg-light");
      header_navbar.classList.remove("shadow");
      colour.classList.remove("scrolled");
      header_navbar.classList.remove("bg-light");
      header_navbar.classList.add("navbar-custom");
    }

  };

}

if (PATHNAME == "store.html") {
  window.onscroll = function () {
    const header_navbar = document.querySelector(".navbar");
    const sticky = header_navbar.offsetTop;
    const colour = document.querySelector(".fixed-top");
    const button = document.getElementById("btn");

    if (window.pageYOffset > sticky) {
      //when not on top
      header_navbar.classList.add("bg-light");
      header_navbar.classList.add("shadow");
      header_navbar.classList.add("scrolled");
      header_navbar.classList.remove("navbar-dark");
      header_navbar.classList.add("navbar-light");
      button.classList.remove("btn-outline-light");
      button.classList.add("btn-outline-dark");
    } else {
      header_navbar.classList.remove("shadow");
      colour.classList.remove("scrolled");
      header_navbar.classList.remove("bg-light");
      header_navbar.classList.add("navbar-dark");
      header_navbar.classList.remove("navbar-light");
      button.classList.remove("btn-outline-dark");
      button.classList.add("btn-outline-light");
    }

  };

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
    change2.innerText = "to login"
  }
  else {
    signup.style.display = "none"
    loginbutton.style.display = "block"
    change1.innerText = "Don't have an account? Click"
    change2.innerText = "to sign up"
  }

})


window.addEventListener("scroll", reveal);

// To check the scroll position on page load
reveal();

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

function displayChatError(checkcondition){
  var chatErrorMessage = document.getElementById("error-msg-chat");
  if(checkcondition == 1 && chatErrorMessage.innerHTML.trim().length == 0)
  {
    const errorMsgg = `<p id = "chat-error">Unable to send empty message. Please try again.</p>`;
    chatErrorMessage.innerHTML += errorMsgg;
  }
  else
  {
    chatErrorMessage.innerHTML = "";
  }
}


if(PATHNAME == "chat.html")
{
  retrieveMessages();
  var checkDisplayError = localStorage.getItem("displayError");
  if (checkDisplayError == 1){
    displayChatError(1);
  }
  else{
    displayChatError(0);
  }
  const msgForm = document.getElementById("messageForm");
  msgForm.addEventListener("submit", () => {
    const msgInput = document.getElementById("msg-input").value;
    if(msgInput === "")
    {
      localStorage.setItem("displayError", 1);
      location.reload();
    }
    else
    {
      localStorage.setItem("displayError", 0);
      writeMessage(msgInput);
    }
  });
}

// function openChat(userId)
// {
//   location.href = "chat.html";
//   retrieveMessages(userId);
//   const msgForm = document.getElementById("messageForm");
//   //const msgBtn = document.getElementById("msg-btn");
//   const msgBtn = document.querySelector("msg-btn");
//   //const msgScreen = document.getElementById("messages"); 
//   //const msgForm = document.getElementById("messageForm");
//   //const msgBtn = document.getElementById("msg-btn").addEventListener("click", writeMessage(userId), false);
//   // window.alert();
//    msgForm.addEventListener("submit", () => {
//     window.alert();
//     const msgInput = document.getElementById("msg-input");
//     writeMessage(userId, msgInput);
//    });
// };

function writeMessage(message) {
  // const msgScreen = document.getElementById("messages"); 
  // const msgForm = document.getElementById("messageForm");
  // const msgBtn = document.getElementById("msg-btn");
  // msgForm.addEventListener("submit", function() {
  //     window.alert();
  //     const msgInput = document.getElementById("msg-input");
  // })
  const userIdentity = localStorage.getItem("uid");
  const userMsg = localStorage.getItem("msging");
  window.alert(userMsg);
  window.alert(userIdentity);
  const chatId = userMsg + userIdentity;
  const currentDate = Date().toLocaleString().replace(",","").replace(/:.. /," ");
  push(ref_database(db, 'messages/'), {
    dateAndTime: currentDate,
    receiver: userMsg,
    sender: userIdentity,
    messagingMsg: message

  }).then(() => {
    location.reload();
  });
}
function retrieveMessages()
{
  const dbRef = ref_database(getDatabase());
  const userIdentify = localStorage.getItem("uid");
  const userMsgg = localStorage.getItem("msging");
  //const currentId = auth.currentUser.uid;
  //const chatId = userIdentify + userId;
  //Array to store messages containing the same chat id
  const msgs = [];
  get(child(dbRef, "messages")).then((snapshot) => {
    if (snapshot.exists)
    {
      //Appending children into array if the chatId matches
      snapshot.forEach(function(_child){
        // if(_child.key == (userMsgg + userIdentify) || _child.key == (userIdentify + userMsgg)){
        //   msgs.push(_child);
        // }
        if((_child.val().receiver == userIdentify || _child.val().receiver == userMsgg) && (_child.val().sender == userIdentify || _child.val().sender == userMsgg))
        {
          msgs.push([_child.val().dateAndTime, _child.val().messagingMsg, _child.val().receiver, _child.val().sender]);
        }
      })
    }
  }) .then(() => {
    //Sorting array of messages by DateTime
    msgs.sort(function (a, b) {
      return b[0].date - a[0].date;
    });

    const msgScreen = document.getElementById("messages");
    const msgForm = document.getElementById("messageForm");
    const msgBtn = document.getElementById("msg-btn");

    for( var i = 0; i < msgs.length; i++)
    {
      if(msgs[i][3] == userIdentify)
      {
        const msg = `<li class="msg my"}"><span class = "msg-span">
                      <i class = "name"></i>${msgs[i][1]}
                      </span>
                      </li>`
        msgScreen.innerHTML += msg;
        document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
      }
      else {
        const msg = `<li class="msg"}"><span class = "msg-span">
                      <i class = "name"></i>${msgs[i][1]}
                      </span>
                      </li>`
        msgScreen.innerHTML += msg;
        document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
      }
    }
  });
}
