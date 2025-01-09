import React from 'react';
import './EligibilityPage.css';
import Navbar from '../components/Navbar';

function EligibilityPage() {
  return (
      <>
          <Navbar />
    <div className="eligibility-page">
      <h2>Eligibility Criteria</h2>

      <div className="criteria-section">
        <h3>For Parents/Guardians:</h3>
        <ul>
          <li>Must be a legal guardian or parent of a child in need of care.</li>
          <li>Must agree to the terms of the platform.</li>
          <li>Must be able to pay for the services (through vouchers, as implemented in our case).</li>
            <li>Must have registered an account.</li>
        </ul>
      </div>

      <div className="criteria-section">
        <h3>For Nannies/Professionals:</h3>
        <ul>
          <li>Must be over 18 years old.</li>
          <li>Must possess qualifications or experience in childcare.</li>
          <li>Must agree to the terms of the platform.</li>
            <li>Must be a registered user.</li>
        </ul>
      </div>
        <p>If you meet the eligibility requirements, you can proceed to register.</p>
    </div>
      </>
  );
}

export default EligibilityPage;