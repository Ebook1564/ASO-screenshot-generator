
import { useStore } from './store/useStore';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';

export default function App() {
  const { view } = useStore();

  return (
    <>
      {view === 'dashboard' && <Dashboard />}
      {view === 'editor' && <Editor />}
    </>
  );
}
