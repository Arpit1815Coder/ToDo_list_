import { useState, useEffect } from 'react';
import {  FaTrash, FaFilter, FaSort, FaPlus } from 'react-icons/fa6';
import './todolist.css'; // Custom styles

const ToDoList = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [taskInput, setTaskInput] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('date');

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (taskInput.trim()) {
            const newTask = { 
                id: Date.now(), 
                text: taskInput.trim(), 
                completed: false,
                date: new Date()
            };
            setTasks([...tasks, newTask]);
            setTaskInput('');
        }
    };

    const handleRemoveTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleToggleCompletion = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    const filteredTasks = tasks.filter(task => 
        filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
    );

    const sortedTasks = filteredTasks.sort((a, b) => 
        sort === 'date' ? new Date(a.date) - new Date(b.date) : a.text.localeCompare(b.text)
    );

    return (
        <div className="todo-container">
            <div className="header-container">
                <h1>To-Do List</h1>
                <div className="control-container">
                    <div className="filter-container">
                        <label><FaFilter />  </label>
                        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                            <option value="all">All</option>
                            <option value="completed">Completed</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                    </div>

                    <div className="sort-container">
                        <label><FaSort />  </label>
                        <select onChange={(e) => setSort(e.target.value)} value={sort}>
                            <option value="date">Date</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="input-container">
                <input 
                    type="text" 
                    value={taskInput} 
                    onChange={(e) => setTaskInput(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    placeholder="Enter a task"
                />
                <button onClick={handleAddTask} className="add-button">
                    <FaPlus />
                </button>
            </div>

            <ul>
                {sortedTasks.map(task => (
                    <li key={task.id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleCompletion(task.id)}
                        />
                        <span 
                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                        >
                            {task.text}
                        </span>
                        <button onClick={() => handleRemoveTask(task.id)} className="delete-button">
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
