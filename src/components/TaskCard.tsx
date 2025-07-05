
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Calendar, User, Share, Trash, Edit, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  dueDate: string;
  assignedTo: string;
  sharedWith: string[];
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: number, updates: any) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "todo": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "todo": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
  const isDueToday = task.dueDate === new Date().toISOString().split('T')[0];

  const handleStatusChange = (newStatus: string) => {
    onUpdate(task.id, { status: newStatus });
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].split('.').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isOverdue ? 'border-red-200 bg-red-50/30' : 'hover:border-blue-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
              {isDueToday && !isOverdue && <Badge className="bg-orange-100 text-orange-800 text-xs">Due Today</Badge>}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
              <Badge className={`${getStatusColor(task.status)} text-xs flex items-center gap-1`}>
                {getStatusIcon(task.status)}
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Mark as Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                <Clock className="h-4 w-4 mr-2" />
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Task
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-red-600 font-medium' : isDueToday ? 'text-orange-600 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{task.assignedTo.split('@')[0]}</span>
            </div>
          </div>

          {task.sharedWith.length > 0 && (
            <div className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              <div className="flex -space-x-2">
                {task.sharedWith.slice(0, 3).map((email, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="text-xs">
                      {getInitials(email)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.sharedWith.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                    +{task.sharedWith.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
