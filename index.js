const express = require('express');

const server = express();

// Informar servidor trabalhar com JSON
server.use(express.json());

const projects = [];
let contadorGlobal = 0;

// Middleware Global
server.use((req,res,next) =>{
  
  contadorGlobal++;
  console.log(`Ja foram chamadas: ${contadorGlobal}  requisicoes`);
  
  return next();

})

// Middleware Local para verificar se o projeto com ID passado por parametro existe
function verificaID(req , res, next){

  const  id  = req.params;

  const project = projects.find( p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project nao encontrado' });
  }


  return next();

}

server.get("/projects",(req,res) =>{
  return res.json(projects);
})

server.post("/projects",(req,res) =>{
    const { id } = req.body;
    const { title } = req.body;

    const project = {
      id,
      title,
      tasks: []
    };

    projects.push(project);

    res.json(projects);

})

server.put("/projects/:id", verificaID , (req,res) =>{
    const index = req.params.id;
    const {title} = req.body;

    //Procura no array projeto pelo id
    const project = projects.find(p => p.id == index);

    project.title = title;
  
    return res.json(project);
})

server.delete("/projects/:id", verificaID, (req,res)=>{
  const index = req.params.id;

  const projectIndex = projects.findIndex(p => p.id == index);
  projects.splice(projectIndex,1);

  return res.send();
})

server.post("/projects/:id/tasks", verificaID, (req,res) =>{
    const id  = req.params.id;
    
    const { title } = req.body;

    project = projects.find( p => p.id == id);

    project.tasks.push(title);

    return res.json(project);

})

server.listen(2000);

