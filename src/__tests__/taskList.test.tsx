
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TaskList from '../components/Tasklist'

const mockStore = configureStore([]);

test('renders TaskList component', () => {
    const store = mockStore({
        tasks: { tasks: [], loading: false, error: null },
    });

    render(
        <Provider store={store}>
            <TaskList />
        </Provider>
    );

    expect(screen.getByText(/Task List/i)).toBeInTheDocument();
});

test('adds a new task', () => {
    const store = mockStore({
        tasks: { tasks: [], loading: false, error: null },
    });

    render(
        <Provider store={store}>
            <TaskList />
        </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Add a task/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText(/ADD Task/i));

    expect(store.getActions()).toEqual([
        { type: 'tasks/addTask/pending' },
        { type: 'tasks/addTask/fulfilled', payload: { id: expect.any(String), title: 'New Task', description: '', completed: false } },
    ]);
});