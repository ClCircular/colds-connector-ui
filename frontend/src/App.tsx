import './App.css'

function App() {
  
  const  jimenaFunciton =  async () => {
    console.log('Jimena function')
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        type: "GET",
        "url": "/api/contracts"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let url = `http://localhost:8083`;
    console.log(url);
    console.log(requestOptions);
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data);
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
