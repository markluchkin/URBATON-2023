const Lesson = require("../models/Lesson");
const Teacher = require("../models/Teacher");
const Group = require("../models/Group");
const Student = require("../models/Student");

const getStudLess = async (studentId) => {
  try {
    //const student = await Student.findById(studentId).populate("timetable");
    const student = await Student.findById(studentId).populate({
      path: "timetable",
      populate: {
        path: "teacher", // assuming "group" is the field name in the Lesson model
        model: "Teacher", // replace with your actual model name for groups
      },
    });
    if (!student) {
      throw new Error("Студент не найден");
    }

    const result = [];

    const groupedByDay = student.timetable.reduce((acc, lesson) => {
      acc[lesson.day] = acc[lesson.day] || [];
      acc[lesson.day].push({
        time: lesson.time,
        subject: lesson.subject,
        teacher: lesson.teacher.name,
        cabinet: lesson.cabinet,
      });
      return acc;
    }, {});

    for (const day in groupedByDay) {
      result.push({
        day: day,
        lessons: groupedByDay[day],
      });
    }

    return result;
  } catch (error) {
    console.error("Ошибка при получении уроков студента:", error.message);
    throw error;
  }
};
const getTeachLess = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId).populate({
      path: "timetable",
      populate: {
        path: "group", // assuming "group" is the field name in the Lesson model
        model: "Group", // replace with your actual model name for groups
      },
    });

    if (!teacher) {
      throw new Error("Преподаватель не найден");
    }

    const result = [];

    const groupedByDay = teacher.timetable.reduce((acc, lesson) => {
      console.log(lesson);
      acc[lesson.day] = acc[lesson.day] || [];
      acc[lesson.day].push({
        time: lesson.time,
        subject: lesson.subject,
        student: lesson.student,
        group: lesson.group.name,
        cabinet: lesson.cabinet,
      });
      return acc;
    }, {});

    for (const day in groupedByDay) {
      result.push({
        day: day,
        lessons: groupedByDay[day],
      });
    }

    return result;
  } catch (error) {
    console.error("Ошибка при получении уроков преподавателя:", error.message);
    throw error;
  }
};
const getAllLess = async () => {
  try {
    const allLessons = await Lesson.find({})
      .sort({ day: 1, time: 1 }) // Sort by day and then time
      .populate("teacher")
      .populate("group");

    const result = [];

    const groupedByDay = allLessons.reduce((acc, lesson) => {
      const dayKey = lesson.day.toString();
      acc[dayKey] = acc[dayKey] || { day: lesson.day, lessons: [] };
      acc[dayKey].lessons.push({
        time: lesson.time,
        subject: lesson.subject,
        teacher: lesson.teacher.name,
        group: lesson.group.name,
        cabinet: lesson.cabinet,
      });
      return acc;
    }, {});

    // Convert the object back to an array
    for (const dayKey in groupedByDay) {
      result.push(groupedByDay[dayKey]);
    }

    return result;
  } catch (error) {
    console.error("Ошибка при получении всех уроков:", error.message);
    throw error;
  }
};

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
  try {
    const teacherId = req.body.teacherId;
    const lessons = await getTeachLess(teacherId);
    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async getStudentLessons(req,res){
  try {
    const studentId = req.body.studentId;
    const lessons = await getStudLess(studentId);
    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async getAllLessons(req,res){
  try {
    const lessons = await getAllLess();
    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = new lessonController();