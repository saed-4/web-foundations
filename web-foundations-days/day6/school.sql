CREATE TABLE students(
    student_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE courses(
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
    );
CREATE TABLE enrollment(
    Grade CHAR,
    enrollment_date DATE,
    student_id INTEGER NOT NULL,
 course_id INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

INSERT INTO students 
(student_id, email, name) 
VALUES
     (1,'s@gmail.com','suo'),
     (2,'a@gmail.com','guo'),
     (3,'l@gmail.com','luO');


INSERT INTO courses 
(course_id,course_name) 
VALUES
      (1,'OOP'),
      (2,'OOAD'),
      (3,'EOP');

INSERT INTO enrollment
    (student_id, course_id, grade, enrollment_date)
VALUES
    (1, 1, 'A', '2026-05-10'),
    (2, 1, 'B', '2026-05-11'),
    (3, 2, 'C', '2026-05-12'),
    (1, 3, 'D', '2026-05-13'),
    (2, 2, 'E', '2026-05-14');


SELECT students.name, courses.course_name
FROM students
JOIN enrollment
    ON students.student_id = enrollment.student_id
JOIN courses
    ON enrollment.course_id = courses.course_id
WHERE students.student_id = 1;


SELECT students.name
FROM students
JOIN enrollment
    ON students.student_id = enrollment.student_id
JOIN courses
    ON enrollment.course_id = courses.course_id
WHERE courses.course_id = 1;




SELECT courses.course_name,
 COUNT(enrollment.student_id) AS total_students
FROM courses
LEFT JOIN enrollment
    ON courses.course_id = enrollment.course_id
GROUP BY courses.course_id, courses.course_name;

SELECT students.name
FROM students
LEFT JOIN enrollment
    ON students.student_id = enrollment.student_id
WHERE enrollment.student_id IS NULL;

UPDATE enrollment
SET grade = 'A'
WHERE student_id = 3
  AND course_id = 2;