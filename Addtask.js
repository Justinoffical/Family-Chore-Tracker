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

// Get a reference to the tasks collection in Firebase
const tasksRef = firebase.firestore().collection("tasks");

// Add Task Form Submission
const addTaskForm = document.querySelector("#addTaskForm");

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get task details from the form
  const taskName = addTaskForm.name.value;
  const taskPoints = Number(addTaskForm.points.value);

  // Generate a unique ID for the new task
  const newTaskId = Math.floor(Math.random() * 1000000);

  // Set the task details in the new task reference using the `set` method
  tasksRef.doc(newTaskId.toString()).set({
    name: taskName,
    points: taskPoints,
    id: newTaskId
  })
  .then(() => {
    console.log("Task added successfully!");
    // Reset the form after the task is added to the database
    addTaskForm.reset();
  })
  .catch((error) => {
    console.error("Error adding task: ", error);
  });
});
