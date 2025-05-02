import { useState } from 'react'

const StatisticsLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, bad, neutral, reviewed }) => {
  if (reviewed === false) {
    return (
      <p>Please give feedback</p>
    )
  }
  return (
    <>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='average' value={(good - bad) / (good + bad + neutral)} />
          <StatisticsLine text='positive' value={(good / (good + bad + neutral) * 100) + '%  '} />
        </tbody>
      </table>
    </>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [reviewed, setReviewed] = useState(false)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => { setBad(bad + 1); setReviewed(true) }} text='bad' />
      <Button onClick={() => { setNeutral(neutral + 1); setReviewed(true) }} text='neutral' />
      <Button onClick={() => { setGood(good + 1); setReviewed(true) }} text='good' />
      <Statistics good={good} bad={bad} neutral={neutral} reviewed={reviewed}></Statistics>
    </div>
  )
}

export default App