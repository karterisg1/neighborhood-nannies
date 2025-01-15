import React from 'react'; 
import './HelpPage.css'; 
import Navbar from '../components/Navbar'; 

function HelpPage() { 
    return ( 
    <> 
        <Navbar /> 
        <div className="help-page"> 
            <h2>Βοήθεια και Υποστήριξη</h2> 
            <div className="help-content"> 
                <p>Αν αντιμετωπίζετε προβλήματα με την εφαρμογή, παρακαλούμε επικοινωνήστε με την υποστήριξη.</p> 
                <p>Μπορείτε να χρησιμοποιήσετε την παρακάτω διεύθυνση email για να στείλετε τις ερωτήσεις ή τις ανησυχίες σας.</p> 
                <a href="mailto:support@nanniesneighborhood.com">support@nanniesneighborhood.com</a> 
                <p>Ή αν θέλετε να επικοινωνήσετε μαζί μας μέσω τηλεφώνου:</p> 
                <a href="tel:+302100000000">+30 210 0000000</a> 
                <p>Είμαστε εδώ για να σας βοηθήσουμε!</p> 
            </div> 
        </div> 
    </> 
    ); 
} 

export default HelpPage;
