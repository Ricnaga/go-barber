import React, {useCallback, useRef} from 'react';
import {FiLogIn, FiMail,FiLock} from 'react-icons/fi';
import * as Yup from 'yup';
import {Form} from '@unform/web';
import {FormHandles} from '@unform/core';
import {Link} from 'react-router-dom'

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors'
import {Container, Content, Background, AnimationContainer} from './styles';
import {useAuth} from '../../hooks/auth';
import {useToast} from '../../hooks/toast';

interface SignInFormData{
    email: string;
    password:string;
}

const SignIn: React.FC = ()=> {

    const formRef = useRef<FormHandles>(null)

    const {signIn} = useAuth()
    const {addToast} = useToast();
  
    const handleSubmit = useCallback( async(data: SignInFormData) => {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                .required('E-mail obrigatório')
                .email('Digite um email válido'),
                password: Yup.string()
                .required('Senha obrigatória'),
            })

            await schema.validate(data, {
                abortEarly: false
            })
            await signIn({
                email: data.email,
                password:data.password,
            })
        } catch (error) {
            if(error  instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error)
                formRef.current?.setErrors(errors)

                return;
            }
            
            addToast({
                type:'error',
                title:'Erro na autenticação',
                description:'Ocorreu um erro ao fazer login,cheque as credenciais',
            });
        }
    },[signIn, addToast])

    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt="GoBarber"/>

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu logon</h1>
                    <Input icon={FiMail} name="email" placeholder="E-mail"/>
                    <Input icon={FiLock} 
                    name="password" 
                    type="password" 
                    placeholder="Senha" />
                    <Button type="submit">Entrar</Button>
                    <Link to="forgot">Esqueci minha senha</Link>
                </Form>
                    <Link to="signup">
                        <FiLogIn/>
                        Criar conta
                    </Link>
            </AnimationContainer>
        </Content>
        <Background />
    </Container>
    )
    };

export default SignIn;