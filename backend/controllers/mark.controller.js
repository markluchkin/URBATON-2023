const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Group = require("../models/Group");
async function fetchTeacherName(teacherId) {
  const teacher = await Teacher.findById(teacherId);
  return teacher ? teacher.name + " " + teacher.surname : 'Unknown Teacher';
}

class markController {

  async createMark(req, res) {
    try {
      const userRole = req.user.role;
      //console.log(userRole);
      if (userRole !== "Teacher" && userRole !== "Admin" && userRole !== "Leader") {
        return res.status(403).json({ error: "В доступе отказано." });
      }
      const {value, studentId } = req.body; //subject
      const teacherId = req.user.userId;
      const teacher = await Teacher.findById(teacherId);
      //console.log(teacher.subject);
      const organization = req.user.organization;
      //console.log(req.user);
      console.log(teacherId);
      const newMark = new Mark({
        subject: teacher.subject,
        value: value,
        student: studentId,
        teacher: teacherId,
        organization: organization,
      });

      await newMark.save();

      await Student.findOneAndUpdate(
        { _id: studentId },
        { $push: { marks: newMark._id } },
        { new: true }
      );

      res.status(201).json({ message: "Оценка поставлена" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
  async getGroupsByTeacher(req, res) {
    const userRole = req.user.role;
    //console.log(userRole);
    if (userRole !== "Teacher" && userRole !== "Admin" && userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    //console.log(req.user);
    const teacherId = req.user.userId;
    //console.log(teacherId);
    try {
      let teacher = await Teacher.findById(teacherId).populate({
        path: 'groups',
        populate: {
          path: 'students',
          select: 'name surname _id',
        },
      });
      if (!teacher) {
        res.status(401).json({ message: "Вы не учитель" });
        console.log("Вы не учитель");
        return;
      }
      //console.log(teacher);
      //console.log(teacher.groups);
      const formattedGroups = await Promise.all(teacher.groups.map(async (groupName) => {
        const group = await Group.findOne({ name: groupName }).populate('students', 'name surname _id');

        if (!group) {
          return {
            name: groupName,
            students: [],
          };
        }

        return {
          name: groupName,
          students: group.students.map(student => ({
            id: student._id,
            name: student.name,
            surname: student.surname
          })),
        };
      }));
      res.status(200).json({ groups: formattedGroups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  async getStudentMark(req, res) {
    const { studentId } = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Ученик не найден' });
    }

    const marks = await Mark.find({ student: studentId }).populate('teacher').exec();

    const groupedMarks = {};
    
    for (const mark of marks) {
      if (!groupedMarks[mark.subject]) {
        groupedMarks[mark.subject] = [];
      }

      const teacherName = await fetchTeacherName(mark.teacher);
      console.log(mark);
      console.log(mark.teacher);
      groupedMarks[mark.subject].push({
        id: mark._id,
        value: mark.value,
        teacher: teacherName,
      });
    }

    // Формируем массив для ответа
    const resultArray = [];
    for (const subject in groupedMarks) {
      resultArray.push({
        subject: subject, // Используем название предмета
        marks: groupedMarks[subject], // Массив оценок для данного предмета
      });
    }

    res.json(resultArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

};

module.exports = new markController();