const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
    </>
  )
}

const Total = ({ parts }) => {
  return (
    <p>Number of exercises {parts.reduce((a, b) => a + b.exercises, 0)}</p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course


