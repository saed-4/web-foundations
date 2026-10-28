
# School Database Design

## 1. Tables

### Students
The students table stores information about students, including their student ID, email and name. The student ID is the primary key, and the email must be unique and cannot be NULL.

### Courses
The courses table stores information about courses, including the course ID and course name. The course ID is the primary key, and the course name is required.

### Enrollment
The enrollment table connects students to courses. It stores the student ID, course ID, grade and enrollment date. The student ID and course ID are foreign keys that reference the students and courses tables. The UNIQUE constraint on student_id and course_id prevents the same student from enrolling in the same course twice.

## 2. Relationships

Students and enrollment have a one-to-many relationship because one student can enrol in many courses, but each enrollment record belongs to one student.

Courses and enrollment also have a one-to-many relationship because one course can have many students, but each enrollment record refers to one course.

Students and courses have a many-to-many relationship because one student can enrol in several courses, and one course can have several students. The enrollment table is needed to connect students and courses and to store information about each enrollment, such as the grade and enrollment date.

## 3. Index

I would add an index on the course_id column in the enrollment table. This would help the database find students enrolled in a particular course more efficiently. It would also help when counting the number of students per course. The primary keys and UNIQUE constraint already create indexes, so this additional index would be useful for course-based searches.

## 4. SQL or NoSQL?

I would choose SQL for this school system because the data has clear relationships between students, courses and enrollment records. SQL supports primary keys, foreign keys and constraints that help prevent invalid or duplicate data. JOIN queries make it possible to retrieve student and course information from multiple tables, while GROUP BY can count students per course. SQLite is a suitable choice for this small system because it is lightweight and supports the SQL features required.
