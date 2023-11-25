const Lesson = require("../models/Lesson");
const Teacher = require("../models/Teacher");

class lessonController{
  async createLesson(req, res){
    try{
      const userRole = req.user.role;
      if (userRole !== "Admin" && userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
      }

      const {teacher, group, subject} = req.body; // maybe time and date

      const teacherId = req.user.userId;
      const teacherBody = await Teacher.findById(teacherId);
      console.log(teacherId);

      const newLesson = new Lesson({
        teacher: teacherId,
        group: group,
        subject: teacherBody.subject,
        organization: teacherBody.organization,
      });

      await newLesson.save();

      res.status(201).json({ message: "Урок создан" });

    }catch(error){
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
}
  
}