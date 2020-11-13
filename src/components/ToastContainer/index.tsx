import React from 'react';
import {Container} from './styles';
import {ToastMessage} from '../../hooks/toast'
import Toast from './Toast'
import {useTransition} from 'react-spring';


interface ToastContainerProps{
 messages:ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({messages}) => {
    const messageWithTransitions = useTransition(
        messages,
        message => message.id,
        {
            from: {right: '-120%', opacity: 0, transform: 'rotateZ(0deg)'},
            enter:{right: '0%',opacity:1, transform: 'rotateZ(360deg)'},
            leave:{right: '-120%', opacity:0, transform: 'rotateZ(0deg)'}
        }

        )
    
    return(
        <Container>
            {messageWithTransitions.map(({item, key, props}) => (
            <Toast key={key} style={props} message={item} />
            ))}
        </Container>
    )
};

export default ToastContainer;