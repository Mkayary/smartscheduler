import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, GripVertical, Trash2 } from 'lucide-react'

export function DraggableTask({ task, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 task-card ${getPriorityBorder(task.priority)} border-l-4 ${
        isDragging ? 'shadow-lg scale-105' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move hover:text-indigo-600 transition-colors"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{task.name}</span>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {task.duration}m
          </span>
          {task.deadline && (
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {task.deadline}
            </span>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(task.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

