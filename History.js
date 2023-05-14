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

// Get a reference to the "done" collection in Firestore
const doneCollection = firebase.firestore().collection("done");

// Get a reference to the HTML element that will display the history
const historyList = document.querySelector("#historyList");

doneCollection.orderBy("date", "desc").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Get the data for the current document
      const data = doc.data();

      // Create a list item to display the history
      const historyItem = document.createElement("li");
      historyItem.innerText = `Date: ${data.date}, Task: ${data.idTask}, User: ${data.idUser}`;
      historyList.appendChild(historyItem);
    });
  })
  .catch((error) => {
    console.error("Error getting history: ", error);
  });
  
