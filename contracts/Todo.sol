// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Todo {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    Task[] public tasks;
    uint public taskCount;

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _content) public {
        tasks.push(Task(taskCount, _content, false));
        taskCount++;
    }

    function toggleCompleted(uint _id) public {
        require(_id < taskCount, "Invalid task ID");
        tasks[_id].completed = !tasks[_id].completed;
    }

    function editTask(uint _id, string memory _content) public {
        require(_id < taskCount, "Invalid task ID");
        tasks[_id].content = _content;
    }

    function deleteTask(uint _id) public {
        require(_id < taskCount, "Invalid task ID");
        delete tasks[_id];
        for (uint i = _id; i < tasks.length - 1; i++) {
            tasks[i] = tasks[i + 1];
        }
        tasks.pop();
        taskCount--;
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }
}
