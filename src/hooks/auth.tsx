import React, {
    createContext, 
    useCallback, 
    useState, 
    useContext
} from 'react'
import api from '../services/api'

interface User{
    id: string;
    name: string;
    avatar_url:string;
}

interface AuthState{
    token: string;
    user: User;
}

interface SignInCredentials{
    email: string;
    password: string;
}

interface AuthContextData{
    user: User;
    signIn(credentials:SignInCredentials): Promise<void>;
    signOut():void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

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

    const signOut = useCallback(async () => {
        localStorage.removeItem('@GoBarber:token')
        localStorage.removeItem('@GoBarber:userWithoutPassword')

        setData({} as AuthState)
    }, [])


    
    return (
        <AuthContext.Provider value={{user: data.user, signIn, signOut}}> 
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth():AuthContextData {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}