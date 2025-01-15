import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AuthContext from '../contexts/AuthContext';
import './UploadLegalDocPage.css';
import Navbar from '../components/Navbar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function UploadLegalDocPage() {
    const [files, setFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const storage = getStorage();
    const handleFileChange = async (e) => {
      const files = Array.from(e.target.files);
     setFiles(files);
    };
      const handleFileUpload = async () => {
          if (files.length === 0) {
           setError('Please select at least one file.');
           return;
         }
        try {
             const uploadUrls = [];
           for (const file of files){
                const fileRef = ref(storage, `legal-docs/${currentUser.uid}/${file.name}`);
            await uploadBytes(fileRef, file);
              const downloadUrl = await getDownloadURL(fileRef);
                uploadUrls.push(downloadUrl);
         }
             setUploadedUrls(uploadUrls);
           const querySnapshot = await getDocs(query(collection(db, 'nannies'), where('userId', '==', currentUser.uid)));
           const fetchedNannies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           if (fetchedNannies.length > 0) {
              const nannyDocRef = doc(db, 'nannies', fetchedNannies[0].id);
              await updateDoc(nannyDocRef, { legalDocs: uploadUrls });
            }

         navigate('/nanny-dashboard')
        } catch (error) {
             console.error('Error uploading legal document:', error);
            setError('Failed to upload legal document, please try again later');
        }
    };
      if (error){
         return <p className="error-message">{error}</p>;
     }
    return (
       <>
           <Navbar />
    <div className="upload-legal-doc-page">
        <h2>Upload Legal Document</h2>
         <div className="document-form">
        <div className="form-group">
              <label htmlFor='legalDocs'>Select legal documents to upload</label>
            <input type='file' id='legalDocs'  multiple onChange={handleFileChange} />
        </div>
             <div className='doc-buttons'>
                 <button onClick={handleFileUpload} className='upload-button'>Upload Document</button>
                </div>
         </div>
        {uploadedUrls.length > 0 ? (
                <div>
                    <h3>Uploaded Documents</h3>
                    {uploadedUrls.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noopener noreferrer">Document {index + 1}</a>
                    ))}
                </div>
                ) : (
                null
             )}
    </div>
        </>
    );
}

export default UploadLegalDocPage;