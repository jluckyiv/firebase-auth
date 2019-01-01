(function() {
  // Initialize Firebase
  firebase.initializeApp(config);

  const STORAGE_AREA = sessionStorage;
  const CURRENT_USER_KEY = "currentUser";
  const IS_SIGNED_OUT = null;
  const IS_SIGNING_IN = "isSigningIn";
  const IS_SIGNING_OUT = "isSigningOut";

  function setCurrentUser(currentUser) {
    STORAGE_AREA.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  function getCurrentUser() {
    return JSON.parse(STORAGE_AREA.getItem(CURRENT_USER_KEY));
  }

  function getCurrentUserString() {
    const currentUser = getCurrentUser();
    switch (currentUser) {
      case IS_SIGNED_OUT:
      case IS_SIGNING_IN:
      case IS_SIGNING_OUT:
        console.log("currentUser", currentUser);
        return currentUser;
      default:
        console.log("currentUser.displayName", currentUser.displayName);
        return currentUser.displayName;
    }
    
  }

  /**
   * Function called when clicking the Login/Logout button.
   */
  function toggleSignIn() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      setCurrentUser(IS_SIGNING_IN);
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/plus.login");
      // firebase.auth().signInWithPopup(provider);
      firebase.auth().signInWithRedirect(provider);
    } else {
      setCurrentUser(IS_SIGNING_OUT);
      firebase
        .auth()
        .signOut()
        .then(function() {
          setCurrentUser(IS_SIGNED_OUT);
        });
    }
    updateUI();
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
      setCurrentUser(user);
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
    updateUI();
  });

  let app = Elm.Main.init({
    node: document.getElementById("elm"),
    flags: getCurrentUserString()
  });
  app.ports.toggleSignIn.subscribe(function() {
    toggleSignIn();
  });

  function updateUI() {
    app.ports.userChanged.send(getCurrentUserString());
  }

})();
