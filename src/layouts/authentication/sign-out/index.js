import React, { useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import icon from "../../../assets/images/icon.png";

const SignOut = () => {

    useEffect(() => {
        // Clear the storage
        localStorage.clear();

        // Redirect to another page
        window.location.href = '/authentication/sign-in';
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>
                <img src={icon} alt="App Icon" />
                <ThreeCircles 
                    visible={true}
                    height = "250"
                    width = "300"
                    color='#3f51b5'
                />
            </div>
        </div>
    );
};

export default SignOut;
