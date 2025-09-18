import React from 'react';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-600' };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, color: 'text-yellow-600' };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'text-gray-600' };
    }
  };

  const daysInfo = getDaysUntilDue(task.due_date);

  return (
    <div className="task-card bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {getStatusText(task.status)}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{task.effort_days} day{task.effort_days > 1 ? 's' : ''} effort</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-600">{formatDate(task.due_date)}</span>
          <span className={`ml-2 font-medium ${daysInfo.color}`}>
            ({daysInfo.text})
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Created {formatDate(task.created_at)}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            title="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;