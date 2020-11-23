const db = firebase.firestore();

const projectContainer = document.getElementById("proyects-container");

const getTasks = (id) => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const updateTask = (id, updatedTask) =>
  db.collection("tasks").doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    projectContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      console.log(doc.data);

      const task = doc.data();
      task.id = doc.id;

      if (!task.fileurl) {
        task.fileurl =
          "https://firebasestorage.googleapis.com/v0/b/silvano-garcia-aspe.appspot.com/o/default.png?alt=media&token=21a6c905-182f-4c59-a54a-a684edda5353";
      }

      projectContainer.innerHTML += `
      <div class="container-fluid">
      <div class="row">
      <div class="col">
      <div class="card card-body mt-2-border-primary product-item" category="${task.category}">
      <h3 class="h5">${task.title}</h3>
      <p>${task.description}</p>
      <p>${task.category}</p>
      <img class="image-fluid" width="300px" src= ${task.fileurl} />
      </div>
      </div>
      </div>
      </div>
`;
    });
  });
});
