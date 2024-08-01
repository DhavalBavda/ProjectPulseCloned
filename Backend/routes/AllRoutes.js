import express from "express";
import multer from 'multer';
const router = express.Router();
import path from 'path'



const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/upload/');
  },
  filename:(req,file,cb)=>{
    cb(null, Date.now()+ path.extname(file.originalname));
  }
});
const upload = multer({
  storage:storage,
  limits: {fileSize: 2*1024*1024}
});




import {
  StudentData,
  TeamsData,
  FacultyData,
  ProjectData,
  NotificationData,
} from "../models/Schemas.js";

//==============StudentData================================================

router.get("/StudentDetail/:id", async (req, res) => {
  try {
    const StuData = await StudentData.findById(req.params.id);
    if (!StuData) {
      return res.status(404).json("Student Not Found");
    }
    res.status(200).json(StuData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ eroor: e.message });
  }
});

router.post("/StudentDetailByEmail",async (req,res)=>{
  try{
    const {email} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const StuData = await StudentData.findOne({email:email})
    if (!StuData){
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(StuData);
    console.log(StuData)
  }catch(err){
    res.status(500).json({message:err.message})
  }
})

router.get("/ShowStudent", async (req, res) => {
  try {
    const AllStudent = await StudentData.find();
    res.status(200).json(AllStudent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ eroor: e.message });
  }
});

router.post("/AddStudent",upload.single('image'), async (req, res) => {
  try {
    console.log(req.body)
    const {
      name,
      email,
      gender,
      enrollmentnumber,
      mobilenumber,
      branch,
      semester,
      division,
      image
    } = req.body;
    const newStudent = new StudentData({
      name,
      email
    });
    if (gender){
      newStudent.gender = gender;
    }
    if (enrollmentnumber){
      newStudent.enrollmentnumber = enrollmentnumber;
    }
    if (mobilenumber){
      newStudent.mobilenumber = mobilenumber;
    }
    if (branch){
      newStudent.branch = branch;
    }
    if (semester){
      newStudent.semester = semester;
    }
    if (division){
      newStudent.division = division;
    }
    if (image){
      newStudent.image = `upload/${req.file.filename}`
    }
    newStudent.save();
    res.json(newStudent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.put("/EditStudent/:id",upload.single('image'), async (req, res) => {
  try {
    console.log("put called",req.body)
    console.log(req.file)
    const StdId = req.params.id;
    const {
      name,
      gender,
      enrollmentnumber,
      email,
      mobilenumber,
      branch,
      semester,
      division,
      image
    } = req.body;
    const updateData = {
      name,
      email
    };
   
    if (gender){
      updateData.gender = gender;
    }
    if (enrollmentnumber){
      updateData.enrollmentnumber = enrollmentnumber;
    }
    if (mobilenumber){
      updateData.mobilenumber = mobilenumber;
    }
    if (branch){
      updateData.branch = branch;
    }
    if (semester){
      updateData.semester = semester;
    }
    if (division){
      updateData.division = division;
    }
    if (req.file){
      updateData.image = `upload/${req.file.filename}`
      console.log("done")
    }
    const EditStudent = await StudentData.findByIdAndUpdate(StdId, updateData);
    res.status(200).json(EditStudent);
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message });
  }
});

router.delete("/DeleteStudent/:id", async (req, res) => {
  try {
    const StdId = req.params.id;
    const DeleteStudent = await StudentData.findByIdAndDelete(StdId);
    res.status(200).json(DeleteStudent);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//==============TeamsData================================================

router.get("/ShowTeams", async (req, res) => {
  try {
    const AllTeams = await TeamsData.find();
    res.status(200).json(AllTeams);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/AddTeams", async (req, res) => {
  try {
    const { TeamName, MentorName, LeaderName, TeamMembers } = req.body;
    const newTeam = new TeamsData({
      TeamName,
      MentorName,
      LeaderName,
      TeamMembers,
    });
    newTeam.save();
    res.status(200).json("newTeam");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/EditTeams/:id", async (req, res) => {
  try {
    const TeamId = req.params.id;
    const { TeamName, MentorName, LeaderName, TeamMembers } = req.body;
    const EditTeamEvent = await TeamsData.findByIdAndUpdate(TeamId, {
      TeamName,
      MentorName,
      LeaderName,
      TeamMembers,
    });
    res.status(200).json(EditTeamEvent);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/DeleteTeams/:id", async (req, res) => {
  try {
    const TeamId = req.params.id;
    const DeleteTeam = await TeamsData.findByIdAndDelete(TeamId);
    res.status(200).json(DeleteTeam);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//==============ProjectData================================================
router.get("/ShowProjects", async (req, res) => {
  try {
    const AllProject = await ProjectData.find();
    res.status(200).json(AllProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/AddProjects", async (req, res) => {
  try {
    const { ProjectTitle, ProjectDescription, Mentorid, Teamid, Year } =
      req.body;
    const newProject = new ProjectData({
      ProjectTitle,
      ProjectDescription,
      Mentorid,
      Teamid,
      Year,
    });
    newProject.save();
    res.status(200).json("newProject");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/EditProjects/:id", async (req, res) => {
  try {
    const ProjectId = rea.params.id;
    const { ProjectTitle, ProjectDescription, Mentorid, Teamid, Year } =
      req.body;
    const EditProject = await ProjectData.findByIdAndUpdate(ProjectId, {
      ProjectTitle,
      ProjectDescription,
      Mentorid,
      Teamid,
      Year,
    });
    res.status(200).json(EditProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/DeleteProjects/:id", async (req, res) => {
  try {
    const ProjectId = rea.params.id;
    const DeleteProject = await ProjectData.findByIdAndDelete(ProjectId);
    res.status(200).json(DeleteProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//==============FacultyData================================================
router.get("/ShowFacultysData", async (req, res) => {
  try {
    const AllFacultys = await FacultyData.find();
    res.status(200).json(AllFacultys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/AddFaculty", async (req, res) => {
  try {
    const { name, facultyid, email, mobilenumber, projectsid } = req.body;
    const newFaculty = new FacultyData({
      name,
      facultyid,
      email,
      mobilenumber,
    });
    if (projectsid) {
      newFaculty.projectsid = projectsid;
    }
    await newFaculty.save();
    res.status(200).json(newFaculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/EditFaculty/:id", async (req, res) => {
  try {
    const Facultyid = req.params.id;
    const { name, facultyid, email, mobilenumber, projectsid } = req.body;
    const updateData = {
      name,
      facultyid,
      email,
      mobilenumber,
    };
    if (projectsid) {
      updateData.projectsid = projectsid;
    }
    const EditFaculty = await FacultyData.findByIdAndUpdate(
      Facultyid,
      updateData,
      { new: true }
    );
    if (!EditFaculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.status(200).json(EditFaculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/DeleteFaculty/:id", async (req, res) => {
  try {
    const Facultyid = req.params.id;
    const DeleteProject = await FacultyData.findByIdAndDelete(Facultyid);
    res.status(200).json(DeleteProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//==============NotificationData================================================
router.get("/ShowAllNotifications", async (req, res) => {
  try {
    const AllNotifications = await NotificationData.find();
    res.status(200).json(AllNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/AddNotifications", async (req, res) => {
  try {
    const { message, deadlineDate, forWhom } = req.body;
    const newNotification = new NotificationData({
      message,
      deadlineDate,
      forWhom,
    });
    newNotification.save();
    res.status(200).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/EditNotification/:id", async (req, res) => {
  try {
    const NotifId = req.params.id;
    const { message, deadlineDate, forWhom } = req.body;
    const EditNotifi = await NotificationData.findByIdAndUpdate(NotifId, {
      message,
      deadlineDate,
      forWhom,
    });
    res.status(200).json(EditNotifi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/DeleteNotification/:id", async (req, res) => {
  try {
    const NotifiId = req.params.id;
    const DeleteNotification = await NotificationData.findByIdAndDelete(
      NotifiId
    );
    res.status(200).json(DeleteNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
