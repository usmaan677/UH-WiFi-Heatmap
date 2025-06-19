import React, { useState } from 'react'
import SubmissionForm from './components/SubmissionForm'
import HeatMapPage from './components/HeatMapPage';



function App() {
  const [submitted, setSubmitted] = useState(false);
  

  return (
    <>
    <div className = "min-h-screen flex items-center justify-center bg-gray-100">
      {!submitted?(
        <SubmissionForm onSubmitComplete={() => setSubmitted(true)} />
        ):(
        <HeatMapPage/>
      )}
    </div>
    </>
  )
}

export default App
