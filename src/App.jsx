import { useState } from 'react'

import './App.css'
import Eip1993 from './components/Eip1993'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Eip1993/>
      </div>
    
    </>
  )
}

export default App
