import initializeFirebase from "../Pages/Login/Login/Firebase/firebase.init";
import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, updateProfile, getIdToken } from "firebase/auth";


// initialize firebase app
initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [admin,setAdmin] = useState(false);
    const [token,setToken] = useState('')
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider()
    const registerUser = (email, password,name,history) => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setAuthError('');
                // const user = {email,displayName:name};
                // setUser(user);
                // set user to database
                saveUser(email,name,'POST');
                history.replace('/');
                updateProfile(auth.currentUser, {
                    displayName: name
                  }).then(() => {
                   
                  }).catch((error) => {
                   
                  });
                  
            })
            .catch((error) => {
                setAuthError(error.message);
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }

    const loginUser = (email, password,location,history) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const destination = location?.state?.from || '/';
                history.replace(destination);
                setAuthError('');
            })
            .catch((error) => {
                setAuthError(error.message);
            })
            .finally(() => setIsLoading(false));
    }
    // google sign in 
    const googleSignIn = (location,history) =>{
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                const destination = location?.state?.form || "/" ;
                history?.replace(destination);
                 // set user to database
                 saveUser(user.email,user.displayName,'PUT')
                setAuthError('');
            }).catch((error) => {
                const errorMessage = error.message;
            setAuthError(errorMessage);
            
            }).finally(() => setIsLoading(false));
    }
    // observer user state
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getIdToken(user).then(function(idToken) {
                   setToken(idToken)
                  }).catch(function(error) {
                    // Handle error
                  });
            } else {
                setUser({})
            }
            setIsLoading(false);
        });
        return () => unsubscribed;
    }, []);
    useEffect(()=>{
        fetch(`https://whispering-river-98579.herokuapp.com/users/${user.email}`)
        .then(res => res.json())
        .then(data => setAdmin(data.admin))
    },[user.email])
    const logout = () => {
        setIsLoading(true);
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        })
            .finally(() => setIsLoading(false));
    }
    const saveUser =(email,displayName,method)=>{
        const user = {email,displayName}
        fetch('https://whispering-river-98579.herokuapp.com/users',{
            method: method,
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify(user)
        }).then(res => res.json())
        .then(data => {
            
        })
    }
    return {
        admin,
        token,
        user,
        isLoading,
        authError,
        registerUser,
        googleSignIn,
        loginUser,
        logout,
    }
}

export default useFirebase;