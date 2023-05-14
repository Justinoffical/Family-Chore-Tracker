const firebaseConfig = {
  apiKey: "AIzaSyB8cyDquq_ztmCmXBGaqAeZRwu2FqzwdRw",
  authDomain: "tododb1.firebaseapp.com",
  projectId: "tododb1",
  storageBucket: "tododb1.appspot.com",
  messagingSenderId: "561537267815",
  appId: "1:561537267815:web:9f0f03dbbbf26f7023fcc2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the users collection in Firebase
const usersRef = firebase.firestore().collection("users");

// Add User Form Submission
const addUserForm = document.querySelector("#addUserForm");

addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get user details from the form
  const userName = addUserForm.name.value;
  // Generate a unique ID for the new user using Firebase's `doc` method
  const newUserRef = usersRef.doc();

  // Generate a unique ID for the new task
  const newTaskId = Math.floor(Math.random() * 1000000);

  // Set the user details in the new user reference using the `set` method
  newUserRef.set({
    name: userName,
    id: newTaskId
  })
  .then(() => {
    console.log("User added successfully!");
    // Reset the form after the user is added to the database
    addUserForm.reset();
  })
  .catch((error) => {
    console.error("Error adding user: ", error);
  });
});