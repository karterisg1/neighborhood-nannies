import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, or, and } from 'firebase/firestore';
import './AdvancedSearchPage.css';
import Navbar from '../components/Navbar';

function AdvancedSearchPage() {
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
  const [specialties, setSpecialties] = useState('');
    const [availability, setAvailability] = useState('');
    const [radius, setRadius] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [availabilityTime, setAvailabilityTime] = useState('');
   const [nannies, setNannies] = useState([]);
    const [error, setError] = useState('');
  const [timeRanges, setTimeRanges] = useState(['9:00','9:30','10:00','10:30','11:00','11:30'])

    useEffect(() => {
        fetchNannies();
    }, []);

    const fetchNannies = async () => {
      try{
       const querySnapshot = await getDocs(collection(db, 'nannies'));
         const nanniesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNannies(nanniesData);
        } catch (error){
            console.error("Error fetching nannies:", error);
            setError('Failed to load nannies. Please try again later.');
        }
    };
    const handleCheckboxChange = (day) => {
      if (daysOfWeek.includes(day)) {
            setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
        } else {
           setDaysOfWeek([...daysOfWeek, day]);
       }
    };

  const handleSearch = async (e) => {
    e.preventDefault();
      let searchQuery = collection(db, 'nannies');
    let constraints = [];
      if (ageMin && ageMax) {
          constraints.push(or(where('age', '>=', ageMin), where('age', '<=', ageMax)))
         }
         if (specialties) {
            constraints.push(where('specialties', '==', specialties));
         }
        if (availability) {
           constraints.push(where('availability', '==', availability));
        }
        if (daysOfWeek.length > 0){
           constraints.push(where('availabilityDays', 'array-contains-any', daysOfWeek));
        }
      if(availabilityTime){
         constraints.push(where('availabilityTimes','array-contains', availabilityTime))
      }


      if(constraints.length > 0){
        searchQuery = query(collection(db, 'nannies'), ...constraints);
      }
    try {
       const querySnapshot = await getDocs(searchQuery);
      const searchNanniesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNannies(searchNanniesData);
    } catch (error){
         console.error("Error searching nannies:", error);
         setError('Failed to search nannies, please try again later.');
      }
  };

    return (
    <>
      <Navbar />
    <div className="advanced-search-page">
         <h2>Advanced Search</h2>
           {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSearch}>
            <div className="form-group">
            <label htmlFor="ageMin">Age Min</label>
            <input type='text' id='ageMin' value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder='Age Min'/>
          </div>
              <div className="form-group">
                <label htmlFor="ageMax">Age Max</label>
                 <input type='text' id='ageMax' value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder='Age Max'/>
          </div>
            <div className="form-group">
                 <label htmlFor="specialties">Specialties</label>
                 <input type="text" id="specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder='Specialties' />
            </div>
             <div className="form-group">
                 <label htmlFor="availability">Availability</label>
                <input type="text" id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder='Availability' />
           </div>
            <div className="form-group">
                <label>Days of Week:</label>
                <div className="checkbox-group">
                    <label><input type="checkbox" value="Monday" checked={daysOfWeek.includes('Monday')} onChange={() => handleCheckboxChange('Monday')} />Monday</label>
                   <label><input type="checkbox" value="Tuesday" checked={daysOfWeek.includes('Tuesday')} onChange={() => handleCheckboxChange('Tuesday')} />Tuesday</label>
                   <label><input type="checkbox" value="Wednesday" checked={daysOfWeek.includes('Wednesday')} onChange={() => handleCheckboxChange('Wednesday')} />Wednesday</label>
                    <label><input type="checkbox" value="Thursday" checked={daysOfWeek.includes('Thursday')} onChange={() => handleCheckboxChange('Thursday')} />Thursday</label>
                    <label><input type="checkbox" value="Friday" checked={daysOfWeek.includes('Friday')} onChange={() => handleCheckboxChange('Friday')} />Friday</label>
                   <label><input type="checkbox" value="Saturday" checked={daysOfWeek.includes('Saturday')} onChange={() => handleCheckboxChange('Saturday')} />Saturday</label>
                  <label><input type="checkbox" value="Sunday" checked={daysOfWeek.includes('Sunday')} onChange={() => handleCheckboxChange('Sunday')} />Sunday</label>
                </div>
            </div>
              <div className='form-group'>
                  <label htmlFor='time'>Availability Time:</label>
                <select value={availabilityTime} onChange={(e) => setAvailabilityTime(e.target.value)}>
                    <option value=''>Select Time</option>
                  {timeRanges.map(time => (
                      <option key={time} value={time}>{time}</option>
                   ))}
                 </select>
            </div>
           <div className="form-group">
               <label htmlFor='radius'>Radius</label>
                 <input type='text' id='radius' value={radius} onChange={(e) => setRadius(e.target.value)} placeholder='Radius' />
         </div>
            <button type="submit" className="search-button">Search</button>
        </form>
           <div className="nannies-container">
             {nannies && nannies.length > 0 ? (
                 nannies.map(nanny => (
                    <div key={nanny.id} className="nanny-card">
                        <h3>{nanny.name}</h3>
                         <p>Experience: {nanny.experience}</p>
                        <p>Specialties: {nanny.specialties}</p>
                        <Link to={`/nanny/${nanny.id}`} className="view-profile-button">Profile</Link>
                   </div>
               ))
          ) : (
             <p>No nannies found.</p>
          )}
       </div>
    </div>
      </>
  );
}

export default AdvancedSearchPage;