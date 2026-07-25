import React, { useState } from 'react';
import { StateProvider } from './StateContext';
import { RadarItemsProvider } from './context/RadarItemsContext';
import { Layout } from './components/Layout';
import { TodayScreen } from './screens/TodayScreen';
import { MoneyScreen } from './screens/MoneyScreen';
import { DeadlinesScreen } from './screens/DeadlinesScreen';
import { InboxScreen } from './screens/InboxScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LandingScreen } from './screens/LandingScreen';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');

  const renderScreen = () => {
    switch (activeTab) {
      case 'today': return <TodayScreen />;
      case 'money': return <MoneyScreen />;
      case 'deadlines': return <DeadlinesScreen />;
      case 'inbox': return <InboxScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <TodayScreen />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderScreen()}
    </Layout>
  );
};

const AppRoot: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);

  if (!isAppStarted) {
    return <LandingScreen onStart={() => setIsAppStarted(true)} />;
  }

  return <AppContent />;
};

const App: React.FC = () => {
  return (
    <StateProvider>
      <RadarItemsProvider>
        <AppRoot />
      </RadarItemsProvider>
    </StateProvider>
  );
};

export default App;