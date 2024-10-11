import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [content, setContent] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [account, setAccount] = useState('');

  const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with your contract address
  const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "createTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "deleteTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "editTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllTasks",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "internalType": "struct Todo.Task[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "taskCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tasks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "toggleCompleted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        const signer = await _provider.getSigner();
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // setAccount(accounts[0]);

        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(contractInstance);
        await getTasks();
      } else {
        alert('MetaMask is not installed. Please install it to use this app.');
      }
    };

    loadProvider();
  }, []);

  const getTasks = async () => {
    if (contract) {
      const tasks = await contract.getAllTasks();
      setTasks(tasks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contract && content) {
      try {
        const tx = await contract.createTask(content);
        await tx.wait();
        setContent('');
        await getTasks();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    } else {
      alert('Please enter a task.');
    }
  };

  useEffect(()=>{
    if (contract) {
      getTasks();
    }
  })

  const toggleCompleted = async (id) => {
    if (contract) {
      try {
        const tx = await contract.toggleCompleted(id);
        await tx.wait();
        await getTasks();
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    const newContent = prompt('Enter new task content:');
    if (newContent) {
      await editTask(id, newContent);
    }
  };

  const editTask = async (id, newContent) => {
    if (contract) {
      try {
        const tx = await contract.editTask(id, newContent);
        await tx.wait();
        await getTasks();
      } catch (error) {
        console.error('Error editing task:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    if (contract) {
      try {
        const tx = await contract.deleteTask(id);
        await tx.wait();
        await getTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Task Manager</h1>
        <form onSubmit={handleSubmit} className="mb-8 max-w-lg mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter task"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-lg"
            />
            <button
              type="submit"
              className="ml-4 px-6 py-2 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Create Task
            </button>
          </div>
        </form>
        <div className="space-y-4 w-[80%] mx-auto">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex justify-between items-center bg-white shadow-md rounded-md p-4">
              <div>
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.content}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleCompleted(task.id)}
                  className={`px-4 py-2 rounded-md ${task.completed ? 'bg-green-500' : 'bg-yellow-500'} text-white`}
                >
                  {task.completed ? 'Completed' : 'Change Status'}
                </button>
                <button
                  onClick={() => handleEdit(task.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
