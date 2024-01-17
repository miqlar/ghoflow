import React from 'react';
import { ConnectKitButton } from 'connectkit';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <ConnectKitButton />
      <div style={{ marginTop: '20px', width: '80%', textAlign: 'center' }}>
        <h1>Welcome to GhoFlow</h1>
        <p>Manage your subscriptions and payments with ease.</p>
        {/* soon superfluid, subscription management, payment options, etc. */}
      </div>
    </div>
  );
}

export default App;
