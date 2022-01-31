import React from "react"
import Tabla from "./Tabla"
import LeftBar from "./LeftBar";
import SelectorFilter from "./SelectFilter";
import Chart from "./Chart"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tituloGrafico: '', 
            labeles: [],
            dataGrafico:[],
            headerTabla: this.props.headerTabla,
            columnas: this.props.columnas,
            favoritos: []
        };
        this.filtoEnfermedad = this.filtoEnfermedad.bind(this);
        this.filtoSelectAnno = this.filtoSelectAnno.bind(this);
        this.agregarFavorito = this.agregarFavorito.bind(this)
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

    renderGrafico(nombreEnfermedad, anno = false){
        let labels = []
        let data = []
        let orden = []
        let resultado = []
        let titulo = ""
        let filter = ''
        let position = '';
        let mesNumerico = ''
        let num = 0
        let meses = {
            1:'Enero',
            2:'Febrero',
            3:'Marzo',
            4:'Abril',
            5:'Mayo',
            6:'Junio',
            7:'Julio',
            8:'Agosto',
            9:'Septiembre',
            10:'Octubre',
            11:'Noviembre',
            12:'Diciembre'
        }
        
        filter = this.props.headerTabla.find(e => e.name == nombreEnfermedad)
        position = filter.position+7;
        titulo = `Muertes en EEUU por ${nombreEnfermedad} ${anno}`

        
        let filtradoData = this.props.data.sort((a, b) => { return a[9] - b[9] }) 
        if(anno == false){ num = 1 }else{ num = 2 }
        
        mesNumerico = this.state.headerTabla[num].cachedContents.top
        mesNumerico = mesNumerico.sort((a,b) => { return a.item - b.item  })
        mesNumerico.map(e => {if(anno != false){ labels.push(meses[Number(e.item)]) }else{ labels.push(e.item) } })

        filtradoData.map(e => { 
            if(anno == false){
                if(nombreEnfermedad == "All Cause"){
                    titulo = `Muertes en EEUU ${nombreEnfermedad} por año (hasta seleccionar un año)`
                }else{
                    titulo = `Muertes en EEUU por ${nombreEnfermedad} por año (hasta seleccionar un año)`
                }
                
                if(labels.includes(e[9])){
                    data.push({"a":Number(e[9]), "v":Number(e[position])})
                }

            }else{
                if(e[9] == anno){
                    resultado.push(e[position])
                } 
            }
        })

        
        if(anno == false){
            data.reduce((res, value) => {
                if (!res[value.a]) {
                    res[value.a] = { v: 0 };
                    orden.push(res[value.a])
                }
                res[value.a].v += value.v;
                return res;
            }, {});

            orden.map(e => {
                resultado.push(e.v);
            })
        }


        this.setState({
            tituloGrafico:titulo,
            labeles:labels,
            dataGrafico:resultado
        })        
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

    filtoEnfermedad(e) {
        let elemento = e.target
        let selectAnno = document.getElementsByClassName("annos")[0]
        let labelEnfermedad = document.getElementsByClassName("nombreEnfermedad")[0]
        let nombreEnfermedad = elemento.innerText
        let anno = false

        selectAnno.value = "0"
        labelEnfermedad.setAttribute('name', elemento.id)
        labelEnfermedad.innerText = nombreEnfermedad

        if(this.state.favoritos.includes(elemento.id)){
            selectAnno.removeAttribute("disabled")
            if(selectAnno.value != 0) anno = selectAnno 
        }else{
            selectAnno.setAttribute("disabled", true)
        }

        this.renderGrafico(nombreEnfermedad, anno)
        this.renderTabla(nombreEnfermedad, anno)
    }

    filtoSelectAnno(e){
        let anno = e.target.value;
        let labelEnfermedad = document.getElementsByClassName("nombreEnfermedad")[0]
        this.renderGrafico(labelEnfermedad.innerText, anno)
        this.renderTabla(labelEnfermedad.innerText, anno)
    }

    agregarFavorito(e){
        if(e.target.type !== undefined){
            let selectAnno = document.getElementsByClassName("annos")[0]
            let nombreEnfermedad = document.getElementsByClassName("nombreEnfermedad")[0].getAttribute('name')
            let name = e.target.name;

            let statusFav = this.state.favoritos
            if(!statusFav.includes(name)){
                statusFav.push(name)
                if(name == nombreEnfermedad) selectAnno.removeAttribute("disabled")
                e.target.classList.remove("btn-dark")
                e.target.classList.add("btn-danger")
                this.setState({ favoritos:statusFav })
            }else{
                statusFav.pop(name)
                selectAnno.setAttribute("disabled", true)
                e.target.classList.add("btn-dark")
                e.target.classList.remove("btn-danger")
                this.setState({ favoritos:statusFav })
            }
        }
    }

    
    componentDidMount(){
        this.renderGrafico("All Cause")
    }
    

    render() {
        return (
            <>
            <Container fluid>
                <h3 className="text-center mt-5 mb-5">Visor Causas de muerte EEUU</h3>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={4}>
                        <LeftBar evento={this.filtoEnfermedad} agregarFavorito={this.agregarFavorito} enfF={this.state.favoritos} data={this.props.headerTabla}/>
                    </Col>
                    <Col xs={12} md={6}>
                        <SelectorFilter evento={this.filtoSelectAnno} data={this.props.headerTabla}/>
                        <Chart labeles={this.state.labeles} data={this.state.dataGrafico} titulo={this.state.tituloGrafico}/>
                        <Tabla headers={this.state.headerTabla} columnas={this.state.columnas} evento={this.cambiarPagina}/>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default Main