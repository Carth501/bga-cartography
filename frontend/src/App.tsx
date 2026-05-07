import { AuthProvider } from './features/auth/AuthProvider';
import { MapWorkspace } from './features/maps/MapWorkspace';

function App() {
  return (
    <AuthProvider>
      <MapWorkspace />
    </AuthProvider>
  );
}

export default App;
