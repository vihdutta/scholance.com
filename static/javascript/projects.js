const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://civichours:zT321312GtQN8xP7@cluster0.ovv1ops.mongodb.net/main?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// add event listener to all elements with class "text-center gp"
document.querySelectorAll('.text-center.gp').forEach(el => {
  el.addEventListener('click', async () => {
    const id = el.id; // assuming the id is a 7 digit zero-padded number

    try {
      await client.connect();
      const db = client.db("main");
      const projects_db = db.collection("projects");
      const query = { "_id": id };
      const project = await projects_db.findOne(query);

      // update several elements based on the fields of the document
      const projectTitle = document.querySelector('#project-title');
      const projectOwner = document.querySelector('#project-owner');
      const tags = document.querySelector('#tags');
      const description = document.querySelector('#description');

      projectTitle.textContent = project.name;
      projectOwner.textContent = `by ${project.owner}`;
      description.textContent = project.description;
      tags.textContent = project.tags;
    } catch (err) {
      console.error(`Failed to fetch document with id ${id}: ${err}`);
    } finally {
      await client.close();
    }
  });
});
