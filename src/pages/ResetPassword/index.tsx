import React, {useCallback, useRef} from 'react';
import {FiLock} from 'react-icons/fi';
import * as Yup from 'yup';
import {Form} from '@unform/web';
import {FormHandles} from '@unform/core';
import {useHistory} from 'react-router-dom'

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors'
import {
    Container, 
    Content, 
    Background, 
    AnimationContainer
} from './styles';
import {useAuth} from '../../hooks/auth';
import {useToast} from '../../hooks/toast';

interface ResetPasswordFormData{
    password:string;
    password_confirmation: string;
}

const SignIn: React.FC = ()=> {

    const formRef = useRef<FormHandles>(null)

    const {signIn} = useAuth()
    const {addToast} = useToast();
    const history = useHistory();
  
    const handleSubmit = useCallback( async(data: ResetPasswordFormData) => {
        try {
            const schema = Yup.object().shape({
                password: Yup.string()
                .required('Senha obrigatória'),

                password_confirmation: Yup.string().oneOf(
                    [ Yup.ref('password'),  ], 
                    'Confirmação incorreta'
                    )
            })

            await schema.validate(data, {
                abortEarly: false
            })

            history.push('/signin')
        } catch (error) {
            if(error  instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error)
                formRef.current?.setErrors(errors)

                return;
            }
            
            addToast({
                type:'error',
                title:'Erro ao resetar a senha',
                description:'Ocorreu um erro ao resetar sua senha, tente novamente',
            });
        }
    },[addToast, history])

    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt="GoBarber"/>

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Resetar senha</h1>

                    <Input icon={FiLock} 
                    name="password" 
                    type="password" 
                    placeholder="Nova senha" />

                    <Input icon={FiLock} 
                    name="password_confirmation" 
                    type="password" 
                    placeholder="Confirmação da senha" />

                    <Button type="submit">Alterar senha</Button>

                </Form>
            </AnimationContainer>
        </Content>
        <Background />
    </Container>
    )
    };

export default SignIn;