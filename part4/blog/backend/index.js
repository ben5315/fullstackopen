const env = require('./utils/config') 
const app = require('./app')

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

