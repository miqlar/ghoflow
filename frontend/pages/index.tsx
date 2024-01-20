import React, { useState } from 'react';
import { ConnectKitButton } from 'connectkit';

const Home = () => {
  // Simplified state and handlers for debugging
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleSubscription = () => {
    setIsWidgetOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <ConnectKitButton />
      <button onClick={handleSubscription}>Confirm Subscription</button>
      {isWidgetOpen && (
        <div>
          {/* Placeholder for Superfluid Widget */}
          <p>Superfluid Widget would be here</p>
        </div>
      )}
    </div>
  );
};

export default Home;