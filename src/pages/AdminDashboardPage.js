import React, { useState, useEffect } from 'react';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboardPage.css';
import Navbar from '../components/Navbar';

function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [nannyCount, setNannyCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const usersCount = await getCountFromServer(collection(db, 'users'));
      setUserCount(usersCount.data().count);

      const nanniesCount = await getCountFromServer(collection(db, 'nannies'));
      setNannyCount(nanniesCount.data().count);

      const contractsCount = await getCountFromServer(collection(db, 'contracts'));
      setContractCount(contractsCount.data().count);
        setLoading(false);
    } catch (error) {
      console.error('Error fetching counts:', error);
        setError("Failed to load, please try again later.");
      setLoading(false);
    }
  };
    if (loading){
      return <p>Loading Admin dashboard...</p>
    }
    if (error) {
        return <p className="error-message">{error}</p>;
    }

  return (
    <>
        <Navbar />
    <div className="admin-dashboard-page">
      <h2>Admin Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{userCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Nannies</h3>
          <p>{nannyCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Contracts</h3>
          <p>{contractCount}</p>
        </div>
      </div>
         <p>More administration tools will be added in the future.</p>
    </div>
    </>
  );
}

export default AdminDashboardPage;