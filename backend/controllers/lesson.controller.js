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

      let {teacher, group, cabinet, day, time} = req.body;
      //console.log(group);
      const groupBody = await Group.findOne({name: group});
      const teacherBody = await Teacher.findById(teacher);
      //console.log(groupBody);
      const newLesson = new Lesson({
        teacher: teacherBody._id,
        group: groupBody._id,
        subject: teacherBody.subject,
        organization: teacherBody.organization,
        students: [], 
        cabinet: cabinet,
        time: time,
        day: day
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
async getTeacherLessons(req, res){
  try{
    const userRole = req.user.role;
    /* console.log(userRole);
    let user;
    if (userRole == "Teacher") {
      user = await Teacher.findById(req.user.userId);
    } 
    else {
      return res.status(403).json({ error: "Нет доступа" });
    }
    console.log(user);
    const lessons = user.timetable.reduce((acc, lesson) => {
      const day = lesson.day;
      const time = lesson.time;
      const subject = lesson.subject;

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push({ time, subject });
      return acc;
    }, {});

    const lessonsArray = Object.entries(lessons).map(([day, timetable]) => ({
      day,
      timetable,
    }));

    res.json(lessonsArray); */

    const formatDayLessons = (lessons) => {
      const formattedLessons = {};

      lessons.forEach((lesson) => {
        const lessonTime = lesson.time;
        const lessonSubject = lesson.subject;

        if (!formattedLessons[lesson.day]) {
          formattedLessons[lesson.day] = [];
        }

        formattedLessons[lesson.day].push(`${lessonTime}: ${lessonSubject}`);
      });

      return formattedLessons;
    };
    let lessons = [];

    if (userRole === "Teacher") {
      const teacherId = req.user._id;
      const teacher = await Teacher.findById(teacherId).populate({
        path: "timetable",
        populate: {
          path: "group",
        },
      });

      if (teacher && teacher.timetable) {
        lessons = formatDayLessons(teacher.timetable);
      }
    } else if (userRole === "Student") {
      const studentId = req.user._id;
      const student = await Student.findById(studentId).populate({
        path: "lessons",
        populate: {
          path: "teacher",
        },
      });

      if (student && student.lessons) {
        lessons = formatDayLessons(student.lessons);
      }
    }

    res.status(200).json(lessons);

  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}
}

module.exports = new lessonController();