import React from 'react';
import './ParentDashboardPage.css';
import Navbar from '../components/Navbar';
import CompletedVouchersPage from './CompletedVouchersPage';
import HistoryPage from './HistoryPage';

function ParentDashboardPage() {

    return(
       <>
            <Navbar />
           <div className="parent-dashboard-page">
                <h2>Parent Dashboard</h2>
               <div className="sections-container">
                    <div className="section-item">
                     <h3>Αιτήσεις</h3>
                   <HistoryPage />
                </div>
                <div className='section-item'>
                     <h3>Vouchers</h3>
                    <CompletedVouchersPage />
              </div>
        </div>
      </div>
        </>
    )
}
export default ParentDashboardPage;