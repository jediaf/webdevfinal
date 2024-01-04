let data = {
  courses: [],
  students: [],
};

// Function to add a course
function addCourse(courseName, gradingScale) {
  let newCourse = {
    name: courseName,
    gradingScale: gradingScale,
    students: [],
  };
  data.courses.push(newCourse);
}

document
  .getElementById("add-course-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let courseName = document.getElementById("course-name").value;
    let gradingScaleInput = document.getElementById(
      "course-grading-scale"
    ).value;
    let gradingScale = parseGradingScale(gradingScaleInput);
    addCourse(courseName, gradingScale);
    updateCourseSelectOptions();
    displayCourses();
  });

document
  .getElementById("add-student-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let selectedCourse = document.getElementById("student-course-select").value;
    let studentId = document.getElementById("student-id").value;
    let studentName = document.getElementById("student-name").value;
    let studentSurname = document.getElementById("student-surname").value;
    if (!isValidName(studentName) || !isValidName(studentSurname)) {
      alert("Invalid name. Please enter letters only.");
      return;
    }

    let midtermScore = parseInt(
      document.getElementById("student-midterm").value
    );
    let finalScore = parseInt(document.getElementById("student-final").value);
    addStudent(
      selectedCourse,
      studentId,
      studentName,
      studentSurname,
      midtermScore,
      finalScore
    );
    displayCourses();
  });
function isValidName(name) {
  return /^[A-Za-z]+$/.test(name);
}
// Function to add a student
function addStudent(
  courseName,
  studentId,
  studentName,
  studentSurname,
  midtermScore,
  finalScore
) {
  let course = data.courses.find((course) => course.name === courseName);
  if (course) {
    course.students.push({
      id: studentId,
      name: studentName,
      surname: studentSurname,
      midterm: midtermScore,
      final: finalScore,
    });
  } else {
    console.error("Course not found");
  }
}
// Use this function when adding or updating a student's name
function check() {
  if (!isValidName(studentName)) {
    alert("Invalid name. Please enter letters only.");
    return;
  }
}
function parseGradingScale(scaleStr) {
  let grades = scaleStr.split(",");
  let scale = {};
  grades.forEach((grade) => {
    let [key, value] = grade.split(":");
    scale[key.trim()] = parseInt(value.trim());
  });
  return scale;
}

function updateCourseSelectOptions() {
  let select = document.getElementById("student-course-select");
  select.innerHTML = "";
  data.courses.forEach((course) => {
    let option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    select.appendChild(option);
  });
}

function displayCourses() {
  let displaySection = document.getElementById("course-details");
  displaySection.innerHTML = ""; // Clear existing content
  data.courses.forEach((course) => {
    let courseDiv = document.createElement("div");
    courseDiv.innerHTML = `<h3>${course.name}</h3>`;
    // Add a delete button for the course
    let deleteCourseButton = document.createElement("button");
    deleteCourseButton.textContent = "Delete Course";
    deleteCourseButton.onclick = () => deleteCourse(course.name);
    courseDiv.appendChild(deleteCourseButton);

    // Display each student with edit and delete options
    course.students.forEach((student) => {
      let studentInfo = document.createElement("p");
      let detailedInfo = displayStudentDetails(student);
      studentInfo.innerHTML = `ID: ${student.id}, ${student.surname} ${student.name} - Midterm: ${student.midterm}, Final: ${student.final}, ${detailedInfo}`;
      courseDiv.appendChild(studentInfo);

      // Add a delete button for the student
      let deleteStudentButton = document.createElement("button");
      deleteStudentButton.textContent = "Delete Student";
      deleteStudentButton.onclick = () =>
        deleteStudent(course.name, student.name);
      studentInfo.appendChild(deleteStudentButton);

      // Add an edit button for the student
      let editStudentButton = document.createElement("button");
      editStudentButton.textContent = "Edit Scores";
      editStudentButton.onclick = () => {
        showEditModal(course.name, student.name);
      };
      studentInfo.appendChild(editStudentButton);
    });
    // Additional code to display course details and students
    displaySection.appendChild(courseDiv);
  });
}

// Call these functions initially
updateCourseSelectOptions();
displayCourses();

//calculate GPA and grades
function calculateGrade(courseName, score) {
  let course = data.courses.find((c) => c.name === courseName);
  if (!course) return null;

  let grades = Object.keys(course.gradingScale).reverse();
  for (let grade of grades) {
    if (score >= course.gradingScale[grade]) {
      return grade;
    }
  }
  return null;
}

function calculateGPA(student) {
  let totalScore = student.midterm * 0.4 + student.final * 0.6;
  let grade = calculateGrade(student.course, totalScore);
  switch (grade) {
    case "A":
      return 4.0;
    case "B":
      return 3.0;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    default:
      return 0;
  }
}
//functions to delete courses and students
function deleteCourse(courseName) {
  data.courses = data.courses.filter((course) => course.name !== courseName);
  updateCourseSelectOptions();
  displayCourses();
}

function deleteStudent(courseName, studentName) {
  let course = data.courses.find((course) => course.name === courseName);
  if (course) {
    course.students = course.students.filter(
      (student) => student.name !== studentName
    );
    displayCourses();
  }
}
//function for edit courses and students
function editStudentScore(courseName, studentName, newMidterm, newFinal) {
  let course = data.courses.find((course) => course.name === courseName);
  if (course) {
    let student = course.students.find(
      (student) => student.name === studentName
    );
    if (student) {
      student.midterm = newMidterm;
      student.final = newFinal;
      displayCourses();
    }
  }
}
function searchStudents() {
  let searchTerm = document.getElementById("search-bar").value.toLowerCase();
  let results = [];
  data.courses.forEach((course) => {
    course.students.forEach((student) => {
      // Debug: log the student object
      console.log(student);

      // Checking if name and surname are strings
      let studentName =
        typeof student.name === "string" ? student.name.toLowerCase() : "";
      let studentSurname =
        typeof student.surname === "string"
          ? student.surname.toLowerCase()
          : "";

      if (
        studentName.includes(searchTerm) ||
        studentSurname.includes(searchTerm) ||
        student.id.toString().includes(searchTerm)
      ) {
        results.push({ ...student, course: course.name });
      }
    });
  });
  // Call a function to display these results
  displaySearchResults(results);
}

function displaySearchResults(results) {
  // Implement logic to display search results
}
let editModal = document.getElementById("editModal");
let span = document.getElementsByClassName("close")[0];

function showEditModal(courseName, studentName) {
  editModal.style.display = "block";

  span.onclick = function () {
    editModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  };

  // Save current editing context
  editModal.dataset.courseName = courseName;
  editModal.dataset.studentName = studentName;
}

function saveEditedScores() {
  let courseName = editModal.dataset.courseName;
  let studentName = editModal.dataset.studentName;
  let newMidterm = document.getElementById("newMidtermScore").value;
  let newFinal = document.getElementById("newFinalScore").value;

  editStudentScore(courseName, studentName, newMidterm, newFinal);
  editModal.style.display = "none";
}
function advancedSearch(criteria) {
  let results = [];
  // Implement advanced search logic based on the criteria
  // For example, filter by course name, score range, etc.
  // ...

  displaySearchResults(results);
}
function filterStudentsByStatus(courseName, status) {
  let course = data.courses.find((course) => course.name === courseName);
  if (!course) return [];

  return course.students.filter((student) => {
    let totalScore = student.midterm * 0.4 + student.final * 0.6;
    return status === "passed" ? totalScore >= 50 : totalScore < 50;
  });
}
function getLetterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function isPassed(letterGrade) {
  return letterGrade !== "F";
}
function displayStudentDetails(student) {
  const totalScore = student.midterm * 0.4 + student.final * 0.6;
  const letterGrade = getLetterGrade(totalScore);
  const status = letterGrade !== "F" ? "Passed" : "Failed";

  return `ID: ${student.id}, Name: ${student.name} ${
    student.surname
  }, Midterm: ${student.midterm}, Final: ${
    student.final
  }, Total: ${totalScore.toFixed(2)}, Grade: ${letterGrade}, Status: ${status}`;
}
