import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

class LeftBar extends React.Component{

    constructor(props){
        super(props)
        this.state = { 
            favorito:this.props.enfF,
            activeTab: props.activeTab || 1
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    enfermedades(){
        let info = this.props.data
        let enfermedades = info.map((e) => { if(e.id != "-1") return e })
            enfermedades = enfermedades.filter((e) => {return e !== undefined})
    
        let r = enfermedades.map((e,i) => {
            if(i > 2){
                return (
                    <Row className="barra">
                        <Col xs={10} md={10}>
                            <p id={e.fieldName} key={e.fieldName} onClick={this.props.evento} className="enfermedades">{e.name}</p>
                        </Col>
                        <Col xs={2} md={2}>
                            <Button name={e.fieldName} key={i} onClick={this.props.agregarFavorito} variant="dark">
                                <FontAwesomeIcon icon={faHeart} />
                            </Button>
                        </Col>
                    </Row>
                )   
    
            } 
        })

        return r
    }

    favoritos(){
        let r = this.props.enfF.map(e => { 
            let elemento = document.getElementById(e)
            return (
                <Row className="barra">
                    <Col xs={10} md={10}>
                        <p id={elemento.id} key={elemento.id} onClick={this.props.evento} className="enfermedades">{elemento.innerText}</p>
                    </Col>
                </Row>
            )
        })

        return r
    }

    buscador(e){
        let todosLosNombreE = document.querySelectorAll(".enfermedades")
        let buscado = e.target.value.toUpperCase()
        let resultados = document.getElementById("resultados")
        todosLosNombreE.forEach(x => {
            let elemento = x.innerText.toUpperCase()
            if(elemento.includes(buscado)){
                x.classList.remove('d-none')
                x.parentElement.nextSibling.classList.remove('d-none')
                resultados.append(x.parentNode.parentElement)
            }else{
                x.classList.add('d-none')
                x.parentElement.nextSibling.classList.add('d-none')
                let buscarDentroResultados = document.querySelectorAll(x.parentNode.parentElement.children[0].childNodes[0].id)
                if(buscarDentroResultados.length > 0){
                    resultados.removeChild(x.parentNode.parentElement)
                }
                resultados.parentElement.append(x.parentNode.parentElement)
            }
        });
    }

    handleSelect(selectedTab) {
        this.setState({ activeTab: selectedTab });
    }

    render(){
        let enfe = this.enfermedades()
        let enfav = this.favoritos()
        return (
            <>
            <Card className="shadow-lg" style={{ width: '30rem' }}>
                <Card.Body>
                    <Row>
                        <Col xs={12} md={12} className="text-left">
                            <Tabs className="myClass" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
                                <Tab key="tab1" eventKey={1} key="Enfermedades" title="Enfermedades">
                                    <Col xs={12} md={12} className="mt-5 mb-5">
                                        <Form.Control type="text" placeholder="Buscador" onChangeCapture={this.buscador} className="mb-5"/>
                                        <div id="resultados"></div>
                                        {enfe}
                                    </Col>
                                </Tab>
                                <Tab key="tab2" eventKey={2} key="Favoritos" title="Favoritos">
                                    <Col xs={12} md={12} className="mt-5 mb-5">
                                        {enfav}
                                    </Col>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </>
        )
    }
}

export default LeftBar