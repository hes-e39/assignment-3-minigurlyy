import React from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import './index.css';
import { TimerProvider } from './context/TimerContext';
import AddTimerView from './views/AddTimerView';
import DocumentationView from './views/DocumentationView';
import TimersView from './views/TimersView';
import WorkoutView from './views/WorkoutView';
import EditTimerView from './views/EditTimerView';
import WorkoutHistoryView from './views/WorkoutHistoryView';
import { ErrorBoundary } from 'react-error-boundary';

// Fallback component for ErrorBoundary
const ErrorFallback = ({ error }: { error: Error }) => (
    <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
    </div>
);

const PageIndex = () => (
    <div>
        <h1 className="main-heading">Workout App</h1>
        <nav>
            <ul className="link-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="add">Add Timer</Link></li>
                <li><Link to="workout">Workout</Link></li>
                <li><Link to="history">Workout History</Link></li>
                <li><Link to="docs">Documentation</Link></li>
            </ul>
        </nav>
        <Outlet />
    </div>
);

const router = createHashRouter([
    {
        path: '/',
        element: <PageIndex />,
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

// Disable Strict Mode only for development
createRoot(document.getElementById('root')!).render(
    process.env.NODE_ENV === 'development' ? (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TimerProvider>
                <RouterProvider router={router} />
            </TimerProvider>
        </ErrorBoundary>
    ) : (
        <React.StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TimerProvider>
                    <RouterProvider router={router} />
                </TimerProvider>
            </ErrorBoundary>
        </React.StrictMode>
    )
);
