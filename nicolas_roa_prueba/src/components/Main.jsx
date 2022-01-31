import React from "react"
import Tabla from "./Tabla"
import Chart from "./Chart"

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headerTabla: this.props.headerTabla,
            columnas: this.props.columnas,
        };
    }
    
    renderTabla(nombreEnfermedad, anno){
        let filtroHeader = ''
        let columnas = []
        let filter = this.props.headerTabla.find(e => e.name == nombreEnfermedad)
        let position = filter.position+7;

        if(nombreEnfermedad == "All Cause"){
            filtroHeader = this.props.headerTabla
            columnas = this.props.columnas
            columnas = columnas.map(e => {
                if(anno != false){
                    if(e.props.children[1].props.children == anno){
                        return e 
                    } 
                }else{
                    return e
                } 
            })
        }else{
            filtroHeader = this.state.headerTabla.slice(0,3);
            filtroHeader.push(filter)
            this.props.data.map(e => { 
                if(anno == false){
                    columnas.push(<tr key={e[1]} ><td>{e[8]}</td><td>{e[9]}</td><td>{e[10]}</td><td>{e[position]}</td></tr>)
                }else{
                    if(e[9] == anno) columnas.push(<tr key={e[1]} ><td>{e[8]}</td><td>{e[9]}</td><td>{e[10]}</td><td>{e[position]}</td></tr>)
                }
            })
        }

        this.setState({
            headerTabla: filtroHeader,
            columnas: columnas
        });
    }

    cambiarPagina = (id) => {
        let pags = document.querySelector(".pagination > .active")
        let pagSelect = document.getElementById(id)
        
        pags.classList.remove('active')
        pagSelect.parentElement.classList.add('active')
    
        let tr = document.querySelectorAll('tbody > tr')
        let transformacion = Array.from(tr)
        transformacion.map((e,i) => {
          if(e.classList.value.includes(id)){
            e.classList.remove('d-none')
          }else{
            e.classList.add('d-none')
          }
        }) 
    }

    filtoSelectAnno(e){
        let anno = e.target.value;
        let labelEnfermedad = document.getElementsByClassName("nombreEnfermedad")[0]
        this.renderTabla(labelEnfermedad.innerText, anno)
    }

    render() {
        return (
            <>
            <Container fluid>
                <h3 className="text-center mt-5 mb-5">Visor Causas de muerte EEUU</h3>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={4}>
                        <p>aqui ira el leftbar</p>
                    </Col>
                    <Col xs={12} md={6}>
                        <SelectorFilter evento={this.filtoSelectAnno} data={this.props.headerTabla}/>
                        <p>aqui ira el Grafico (Chart)</p>
                        <Tabla headers={this.state.headerTabla} columnas={this.state.columnas} evento={this.cambiarPagina}/>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default Main