
import { Button, Col, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';



export default function LoginPage() {
    const[usuario, setUsuario] = useState('')
    const[codigoUsuario, setCodigoUsuario] = useState('')
    const[idUsuario, setIdUsuario] = useState('')
    const[logado, setLogado] = useState(false)

    function salvarUsuario(e: any) {
        setUsuario(e.target.value);
      }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                        Usuário deve estar logado no Portal JMonte 3343

                        <Button type='primary' style={{ width: '100px', margin: '10px', color: 'fff'}}>
                            <Link to='http://localhost/j-portal/' target="_blank" style={{ color: '#fff' }} >Login</Link>
                        </Button>
                    </div>
                </Typography>

            </div>
        </>
    )
}