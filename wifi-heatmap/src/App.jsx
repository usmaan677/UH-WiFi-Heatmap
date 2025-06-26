import React, { useState } from 'react'
import SubmissionForm from './components/SubmissionForm'
import HeatMapPage from './components/HeatMapPage';



function App() {
  const [submitted, setSubmitted] = useState(false);
  

  return (
    <>
    <div className = "min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {!submitted?(
        <SubmissionForm onSubmitComplete={() => setSubmitted(true)} />
        ):(
        <HeatMapPage setSubmitted = {setSubmitted}/>
      )}
    </div>
    </>
  )
}

export default App
