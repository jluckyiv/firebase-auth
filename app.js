(function() {

  // Initialize Firebase
  firebase.initializeApp(config);

  const session = {
    storageArea: sessionStorage,
    authStatusKey: "authStatus",
    currentUserKey: "currentUser",
    IS_SIGNED_IN: "isSignedIn",
    IS_SIGNED_OUT: "isSignedOut",
    IS_SIGNING_IN: "isSigningIn",
    IS_SIGNING_OUT: "isSigningOut",
    getStatus: function() {
      return session.storageArea.getItem(session.authStatusKey);
    },
    setStatus: function(authStatus, currentUser) {
      session.storageArea.setItem(session.authStatusKey, authStatus);
      session.storageArea.setItem(
        session.currentUserKey,
        JSON.stringify(currentUser)
      );
    }
  };

  /**
   * Function called when clicking the Login/Logout button.
   */
  function toggleSignIn() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      session.setStatus(session.IS_SIGNING_IN, null);
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/plus.login");
      // firebase.auth().signInWithPopup(provider);
      firebase.auth().signInWithRedirect(provider);
    } else {
      session.setStatus(session.IS_SIGNING_OUT, currentUser);
      firebase
        .auth()
        .signOut()
        .then(function() {
          session.setStatus(session.IS_SIGNED_OUT, null);
        });
    }
    updateUI(session.getStatus(), currentUser);
  }

  firebase
    .auth()
    .getRedirectResult()
    .then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
      } else {
      }
      const user = result.user;
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      if (errorCode === "auth/account-exists-with-different-credential") {
        alert(
          "You have already signed up with a different auth provider for that email."
        );
      } else {
        console.error(error);
      }
    });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      session.setStatus(session.IS_SIGNED_IN, user);
      // displayName = user.displayName;
      // email = user.email;
      // emailVerified = user.emailVerified;
      // photoURL = user.photoURL;
      // isAnonymous = user.isAnonymous;
      // uid = user.uid;
      // providerData = user.providerData;
    } else {
      // User is not signed in.
    }
    updateUI(session.getStatus(), user);
  });

  const SIGN_IN_BUTTON_ID = "quickstart-sign-in";

  function updateUI(authStatus, currentUser) {
    const button = document.getElementById(SIGN_IN_BUTTON_ID);
    function clearStyles() {
      button.classList.remove(
        "is-danger",
        "is-info",
        "is-loading",
        "is-primary",
        "is-warning"
      );
    }
    switch (authStatus) {
      case session.IS_SIGNED_IN:
        clearStyles();
        button.classList.add("is-primary");
        button.textContent = "Sign out " + currentUser.displayName;
        button.disabled = false;
        break;
      case session.IS_SIGNING_OUT:
        button.classList.add("is-loading");
        // button.textContent = "Signing out....";
        button.disabled = true;
        break;
      case session.IS_SIGNING_IN:
        button.classList.add("is-loading");
        // button.textContent = "Sign in with Google";
        button.disabled = true;
        break;
      default:
        clearStyles();
        button.classList.add("is-info");
        button.textContent = "Sign in with Google";
        button.disabled = false;
        break;
    }
  }

  document
    .getElementById(SIGN_IN_BUTTON_ID)
    .addEventListener("click", toggleSignIn, false);
})();
