const Lesson = require("../models/Lesson");
const Teacher = require("../models/Teacher");
const Group = require("../models/Group");
const Student = require("../models/Student");

class lessonController{
  async createLesson(req, res){
    try{
      const userRole = req.user.role;
      // добавить проверку на пустоту
      if (userRole !== "Admin" && userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
      }

      let {teacher, group} = req.body; // maybe time and date
      //console.log(group);
      const groupBody = await Group.findOne({name: group});
      const teacherBody = await Teacher.findById(teacher);
      //console.log(groupBody);
      const newLesson = new Lesson({
        teacher: teacherBody._id,
        group: groupBody._id,
        subject: teacherBody.subject,
        organization: teacherBody.organization,
        students: []
      });

      teacherBody.timetable.push(newLesson._id);
      await teacherBody.save();

      const groupStudents = await Group.findById(groupBody._id).populate("students").exec();
      console.log(groupStudents);
      groupStudents.students.forEach(async (student) => {
        console.log(student)
        student.timetable.push(newLesson._id);
        await student.save();

        newLesson.students.push(student._id);
      });

      await newLesson.save();

      res.status(201).json({ message: "Урок создан" });

    }catch(error){
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
}
  
}

module.exports = new lessonController();