import React, {createContext, useCallback, useState} from 'react'
import api from '../services/api'

interface AuthState{
    token: string;
    user: object;
}

interface SignInCredentials{
    email: string;
    password: string;
}

interface AuthContextData{
    user: object;
    signIn(credentials:SignInCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({children}) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@GoBarber:token')
        const user = localStorage.getItem('@GoBarber:userWithoutPassword')

        if(token && user){
            return {token, user: JSON.parse(user)}
        }

        return {} as AuthState
    })

    const signIn = useCallback( async ({email, password}) =>{
        const response = await api.post('sessions',{
            email,
            password,
        })
        
        const {token, userWithoutPassword} = response.data
        const user = userWithoutPassword;

        localStorage.setItem('@GoBarber:token', token)
        localStorage.setItem('@GoBarber:userWithoutPassword', JSON.stringify(user))

        setData({token, user})
    }, [])
    return (
        <AuthContext.Provider value={{user: data.user, signIn}}> 
        {children}
        </AuthContext.Provider>
    )
}
