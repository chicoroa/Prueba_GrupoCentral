import React from "react"
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Pagination from 'react-bootstrap/Pagination'

class Tabla extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        data: this.props.headers
    };
}

  paginacion = () => {
    let items = [];
    let totalPaginas = Math.ceil(this.props.columnas.length / 10) 
    for (let number = 1; number <= totalPaginas; number++) {
      let id = `${number}_pag`
      items.push(
        <Pagination.Item key={number} id={id} onClick={() => this.props.evento(id, (number * 10))}>
          {number}
        </Pagination.Item>,
      );
    }
    return items
  }
  
  
  crearTabla = () => {
    
    let headers = this.props.headers.map((e,i) => {
        return (
          <OverlayTrigger key={i} overlay={
            <Tooltip id="tooltip-disabled">
            <span>{ e.name }</span>
          </Tooltip>  
          }>
          <th key={e.fieldName}>{ e.length >= 10 ? e.name : e.name }</th>
          </OverlayTrigger>
      )
    })
    return headers
  }

  columnas = () => {
      let tr = document.querySelectorAll('tbody > tr')
      let transformacion = Array.from(tr)
      let clase = 0
      let c = 1
      let primeraPag = document.getElementById(`${c}_pag`).parentElement.classList.add('active')
      transformacion.map((e,i) => {
        
        if(i % 10 == 0){
          clase = `${c}_pag`
          c++
        }
        e.setAttribute('class', clase)

        if(i > 10){
          e.classList.add('d-none')
        }

      })
  }

  componentDidUpdate(){
   this.columnas() 
  }

  render(){
    let headers = this.crearTabla()
    let paginacion = this.paginacion()
     return (
       <>
       <Table striped bordered hover responsive>
          <thead>
          <tr>{headers}</tr>
          </thead>
          <tbody>
            {this.props.columnas}
          </tbody>
        </Table>
        <Pagination>{paginacion}</Pagination>
       </>
     )
  }

}

export default Tabla