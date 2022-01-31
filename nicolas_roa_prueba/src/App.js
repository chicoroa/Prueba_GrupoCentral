import { useFetch }  from './services/data';
import Main from "./components/Main"


function App() {
  let datosHeaders = ''
  let columnas = []

    const { data, loading, error } = useFetch()
  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>
  
  if(data.length != 0){
    datosHeaders = data.meta.view.columns.map((e) => { if(e.id !== -1) return e })
    datosHeaders = datosHeaders.filter((e) => {return e !== undefined})
    data.data.forEach((e, i) => {
        let td = []
        let id = e[0]
        let arrayTD = e.slice(8, e.length)
        arrayTD.map((e,i) => {
            td.push(<td key={i}>{e}</td>)
        })
        columnas.push(<tr key={id}>{td}</tr>)
    })
  }

  return (
    <div className="App">
      { datosHeaders != '' ? <Main data={data.data} headerTabla={datosHeaders} columnas={columnas}/> : ''}
    </div>
  );
}

export default App;
