
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search, Bell, Settings, User, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

const mockTasks = [
  {
    id: 1,
    title: "Design homepage mockups",
    description: "Create wireframes and high-fidelity designs for the new homepage",
    priority: "high",
    status: "in-progress",
    dueDate: "2025-07-06",
    assignedTo: "john.doe@example.com",
    sharedWith: ["jane.smith@example.com"],
    createdAt: "2025-07-01",
  },
  {
    id: 2,
    title: "Review pull requests",
    description: "Review and approve pending pull requests from the team",
    priority: "medium",
    status: "todo",
    dueDate: "2025-07-05",
    assignedTo: "john.doe@example.com",
    sharedWith: [],
    createdAt: "2025-07-02",
  },
  {
    id: 3,
    title: "Prepare presentation slides",
    description: "Create slides for tomorrow's client presentation",
    priority: "high",
    status: "completed",
    dueDate: "2025-07-04",
    assignedTo: "john.doe@example.com",
    sharedWith: ["jane.smith@example.com", "mike.wilson@example.com"],
    createdAt: "2025-06-30",
  },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    toast({
      title: "Welcome!",
      description: `Successfully logged in with ${provider}`,
    });
  };

  const handleCreateTask = (taskData: any) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: "todo",
      assignedTo: "john.doe@example.com",
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
    toast({
      title: "Task Created",
      description: "Your new task has been added successfully",
    });
  };

  const handleTaskUpdate = (taskId: number, updates: any) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully",
    });
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Your task has been removed successfully",
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case "due-today":
        return task.dueDate === new Date().toISOString().split('T')[0];
      case "overdue":
        return new Date(task.dueDate) < new Date() && task.status !== "completed";
      case "high-priority":
        return task.priority === "high";
      case "completed":
        return task.status === "completed";
      case "in-progress":
        return task.status === "in-progress";
      default:
        return true;
    }
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "completed").length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              TaskFlow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your productivity with intelligent task management, real-time collaboration, and seamless team coordination.
            </p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Smart Task Management</CardTitle>
                <CardDescription>
                  Organize, prioritize, and track your tasks with intelligent filtering and sorting options.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <User className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share tasks, assign team members, and collaborate in real-time with live updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <Bell className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Stay synchronized with instant notifications and live task updates across all devices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          filter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {filteredTasks.length} tasks
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overdue</p>
                      <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filter === "all" ? "All Tasks" : 
                 filter === "due-today" ? "Due Today" :
                 filter === "overdue" ? "Overdue Tasks" :
                 filter === "high-priority" ? "High Priority" :
                 filter === "completed" ? "Completed Tasks" :
                 filter === "in-progress" ? "In Progress" : "Tasks"}
              </h2>
              
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first task"}
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Index;
