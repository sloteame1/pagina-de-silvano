// SingIn
const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  // Authenticate the User
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    // clear the form
    signInForm.reset();
    // close the modal
    $("#signinModal").modal("hide");
    console.log('sign in')
  });
});

//Signup code
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit',(e) => {
e.preventDefault();
const email = document.querySelector('#signup-email').value;
const password = document.querySelector('#signup-password').value;

auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
        
        //reset the form
        signupForm.reset();

        //close modal
        $('#signupModal').modal('hide')
        console.log('sign up')
    })

});


const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log('sign out')
    })
});

auth.onAuthStateChanged((user) => {
    if (user) {
      if(user.uid === "17pN7GTOVMd7FNXkdOusWGOz7e83" || user.uid === "ThTvgkgaGYYU5wOapUgFL9pbeEJ3"){
        const crudNav = document.querySelector("#crudnav");
        crudNav.classList.remove('d-none');
      }
      console.log("signin");
    } else {
      console.log("signout");
    }
  });