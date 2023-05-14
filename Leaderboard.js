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
  // Lager en referanse til databasen
  let db = firebase.firestore();
  
  
  const usersSelect = document.getElementById("users");
  const taskSelect = document.getElementById("tasks");
  const regButton = document.getElementById("btnRegister");
  const yearSelect = document.getElementById("year");
  const monthSelect = document.getElementById("month");
  const divReport = document.getElementById("detail-report");
  
  //https://www.w3schools.com/js/js_object_maps.asp
  const users = new Map();
  const tasks = new Map();
  const familyPoints = new Map();
  const log = [];
  
  main();
  
  async function main() {
    const data = await fetchData()
    populateFamilyMembers(users);
    populateTasks(tasks);
    table = generateTable(familyPoints );
    divReport.innerHTML= "";
    divReport.appendChild(table);
  }
  
  // Henter HTML-elementer
  async function fetchData() {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
     
      // Fetch family members
      const usersSnapshot = await db.collection('users').get();
        usersSnapshot.forEach((doc) => {
        users.set(doc.data().id, doc.data().name);
        familyPoints.set(doc.data().name, 0);
      });
    
      // Fetch chores
      const taskSnapshot = await db.collection('tasks').get();
      const taskSelect = document.getElementById("tasks");
      taskSelect.style.display = "none";
      taskSnapshot.forEach((doc) => {
        tasks.set(doc.data().id, { name: doc.data().name, points: doc.data().points });
      });
  
      
    
      // Fetch done chores
      const logSnapshot = await db.collection('done')
        //.where('date', '>=', new Date(currentYear, currentMonth - 1, 1))
        //.where('date', '<', new Date(currentYear, currentMonth, 1))
        .get();
    
        
        logSnapshot.forEach((doc) => {
          console.log(doc.data());
          const idUser = parseInt(doc.data().idUser);
          const idTask = parseInt(doc.data().idTask);
          const date = doc.data().date;
          try {
            const taskPoints = tasks.get(idTask).points;
            const taskName = tasks.get(idTask).name;
            const username = users.get(idUser);
            familyPoints.set(username, familyPoints.get(username) + taskPoints);
            log.push([['name', username],['date', date],['task', taskName], ['points',taskPoints]]);
          }
          catch(err) {
            console.log(err.message);
          }
          
        
      });
      
    
      return { users, tasks, familyPoints, log };
    }
    
  
    
  
  
    function populateFamilyMembers(users) {
      usersSelect.innerHTML = "";
      users.forEach((name, id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        usersSelect.appendChild(option);
      });
  }
  
  function populateTasks(tasks) {
      taskSelect.innerHTML = "";
      tasks.forEach(({ name, points }, id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${name} (${points} pts)`;
        taskSelect.appendChild(option);
      });
  }
  
  
  regButton.addEventListener("click", async () => {
    const selectedUserId = parseInt(usersSelect.value);
    const selectedTaskId = parseInt(taskSelect.value);
    const username = users.get(selectedUserId);
    const taskPoints = tasks.get(selectedTaskId).points
    const taskName = tasks.get(selectedTaskId).name
    const dateTime = new Date().toISOString();
    familyPoints.set(username, familyPoints.get(username) + taskPoints);
    log.push([['name', username],['date', dateTime],['task', taskName], ['points',taskPoints]]);
  
    
    
    try {
      await db.collection("done").add({
        idUser: selectedUserId,
        idTask: selectedTaskId,
        date: dateTime    
    });
  
      console.log("Chore added successfully");
      table = generateTable(familyPoints );
      divReport.innerHTML= "";
      divReport.appendChild(table);
  
    } catch (error) {
      console.error("Error adding chore:", error);
    }
  });
  
  
  
  function generateTable(familyPoints) {
    // Sort familyPoints Map by their values in descending order
    const sortedFamilyPoints = new Map([...familyPoints.entries()].sort((a, b) => b[1] - a[1]));
  
    const table = document.createElement('table');
    let tableHtml = `<thead>
      <tr>
        <th>Rank</th>
        <th>Member</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>`;
  
    let rank = 1;
    for (const [name, points] of sortedFamilyPoints) {
      tableHtml += '<tr>';
      tableHtml += `<td>${rank}</td>`;
      tableHtml += `<td>${name}</td>`;
      tableHtml += `<td>${points}</td>`;
      tableHtml += '</tr>';
      rank++;
    }
  
    table.innerHTML = tableHtml + '</tbody>';
    return table;
  }
  
  

    