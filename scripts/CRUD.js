///////////////////////////////base de datos////////////////////////
const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

let editStatus = false;

async function uploadImage(file) {
  const ref = firebase.storage().ref();
  const name = new Date() + "-" + file.name;
  const metadata = { contentType: file.type };
  const snapshot = await ref.child(name).put(file, metadata);
  const url = await snapshot.ref.getDownloadURL();
  return url;
}

const saveTask = (title, description, category, fileurl) =>
  db.collection("tasks").doc().set({
    title,
    description,
    category,
    fileurl
  });

const getTasks = (id) => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const DeleteTasks = (id) => db.collection("tasks").doc(id).delete();

const EditTasks = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) =>
  db.collection("tasks").doc(id).update(updatedTask);

let id = "";

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      console.log(doc.data);

      const task = doc.data();
      task.id = doc.id;

      if (!task.fileurl) {
        task.fileurl =
          "https://firebasestorage.googleapis.com/v0/b/silvano-garcia-aspe.appspot.com/o/default.png?alt=media&token=21a6c905-182f-4c59-a54a-a684edda5353";
      }

      taskContainer.innerHTML += `<div class="card card-body mt-2-border-primary m-2">
      <h3 class="h5">${task.title}</h3>
      <p>${task.description}</p>
      <p>${task.category}</p>
      <img class="image-fluid" width="300px" src= ${task.fileurl} />

      <div class = "my-2">
      <button class="btn btn-primary btn-delete" data-id="${task.id}">Borrar</button>
      <button class="btn btn-secondary btn-edit" data-id="${task.id}">Editar</button>
      </div>`;

      const btnsDelete = document.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          DeleteTasks(e.target.dataset.id);
        });
      });

      const btnsEdit = document.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const doc = await EditTasks(e.target.dataset.id);
          const task = doc.data();

          editStatus = true;
          id = doc.id;

          taskForm["task-title"].value = task.title;
          taskForm["task-description"].value = task.description;
          taskForm["task-category"].value = task.categoria;
          taskForm["btn-task-form"].innerText = "Actualizar";
        });
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const categoria = taskForm["task-category"];
  const file = taskForm["task-image"].files[0];

  let fileurl = null;

  if (file) {
    fileurl = await uploadImage(file);
  }

  console.log(categoria.value);

  if (!editStatus) {
    await saveTask(title.value, description.value, categoria.value, fileurl);
  } else {
    if (file) {
      await updateTask(id, {
        title: title.value,
        description: description.value,
        category: categoria.value,
        fileurl
      });
    } else {
      await updateTask(id, {
        title: title.value,
        description: description.value,
        category: categoria.value
      });
    }
  }

  getTasks();

  id = "";
  editStatus = false;
  taskForm["btn-task-form"].innerText = "Guardar";

  taskForm.reset();
  title.focus();
});
