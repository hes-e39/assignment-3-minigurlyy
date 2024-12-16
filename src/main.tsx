import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import './index.css';
import { TimerProvider } from './context/TimerContext';
import AddTimerView from './views/AddTimerView';
import DocumentationView from './views/DocumentationView';
import TimersView from './views/TimersView';
import WorkoutView from './views/WorkoutView';
import EditTimerView from './views/EditTimerView';
import WorkoutHistoryView from './views/WorkoutHistoryView';

// Simple fallback UI in case of an error
const ErrorFallback = () => (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Something went wrong!</h2>
        <p>We're sorry for the inconvenience. Please refresh the page or try again later.</p>
    </div>
);

const PageIndex = () => {
    return (
        <div>
            <h1 className="main-heading">Workout App</h1>
            <nav>
                <ul className="link-list">
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
};

// Define routes for the application
const router = createHashRouter([
    {
        path: '/',
        element: <PageIndex />,
        children: [
            { index: true, element: <TimersView /> }, // Home page to list timers
            { path: 'add', element: <AddTimerView /> }, // Add a timer
            { path: 'workout', element: <WorkoutView /> }, // Workout view
            { path: 'edit/:id', element: <EditTimerView /> }, // New route for editing a timer
            { path: 'history', element: <WorkoutHistoryView /> }, // Workout history route
            { path: 'docs', element: <DocumentationView /> }, // Documentation
        ],
    },
]);

// Render the application
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TimerProvider>
                <RouterProvider router={router} />
            </TimerProvider>
        </ErrorBoundary>
    </StrictMode>,
);

export default router;
