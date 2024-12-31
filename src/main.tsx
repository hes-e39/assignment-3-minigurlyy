import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';
import { TimerProvider } from './context/TimerContext';
import AddTimerView from './views/AddTimerView';
import DocumentationView from './views/DocumentationView';
import EditTimerView from './views/EditTimerView';
import TimersView from './views/TimersView';
import WorkoutHistoryView from './views/WorkoutHistoryView';
import WorkoutView from './views/WorkoutView';

// Error Fallback Component
const ErrorFallback = ({ error }: { error: Error }) => (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Something went wrong!</h2>
        <p>{error.message || 'Page not found'}</p>
    </div>
);

// Navigation Layout
const AppLayout = () => (
    <div>
        <h1 className="main-heading" style={{ textAlign: 'center', marginTop: '20px' }}>
            Workout App
        </h1>
        <nav style={{ textAlign: 'center', marginBottom: '20px' }}>
            <ul style={{ display: 'inline-flex', listStyle: 'none', gap: '15px', padding: 0 }}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="add">Add Timer</Link>
                </li>
                <li>
                    <Link to="workout">Workout</Link>
                </li>
                <li>
                    <Link to="history">Workout History</Link>
                </li>
                <li>
                    <Link to="docs">Documentation</Link>
                </li>
            </ul>
        </nav>
        <Outlet />
    </div>
);

// Router Configuration
const router = createHashRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <ErrorFallback error={new Error('Page not found')} />,
        children: [
            { index: true, element: <TimersView /> },
            { path: 'add', element: <AddTimerView /> },
            { path: 'workout', element: <WorkoutView /> },
            { path: 'edit/:id', element: <EditTimerView /> },
            { path: 'history', element: <WorkoutHistoryView /> },
            { path: 'docs', element: <DocumentationView /> },
        ],
    },
]);

// Main App Rendering
const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TimerProvider>
                    <RouterProvider router={router} />
                </TimerProvider>
            </ErrorBoundary>
        </React.StrictMode>,
    );
} else {
    console.error('Root element not found! Ensure there is a div with id="root" in your index.html.');
}
