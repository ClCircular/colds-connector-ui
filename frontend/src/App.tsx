import './App.css'

function App() {
  
  const jimenaFunciton = () => {
    console.log('Jimena function')
  }

  return (
    <>
      <button
        onClick={jimenaFunciton}
      >
        Jimena Button
      </button>
    </>
  )
}

export default App
