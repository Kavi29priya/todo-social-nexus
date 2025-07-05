
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle, Filter, Menu, X, User, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

export const Sidebar = ({ isOpen, onToggle, filter, onFilterChange, stats }: SidebarProps) => {
  const filterItems = [
    { id: "all", label: "All Tasks", icon: Calendar, count: stats.total },
    { id: "due-today", label: "Due Today", icon: Clock, count: 0 },
    { id: "overdue", label: "Overdue", icon: AlertCircle, count: stats.overdue },
    { id: "high-priority", label: "High Priority", icon: AlertCircle, count: 0 },
    { id: "in-progress", label: "In Progress", icon: Clock, count: stats.inProgress },
    { id: "completed", label: "Completed", icon: CheckCircle2, count: stats.completed },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isOpen && (
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {isOpen && (
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>
          )}

          {filterItems.map((item) => {
            const Icon = item.icon;
            const isActive = filter === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                } ${!isOpen ? "px-2" : ""}`}
                onClick={() => onFilterChange(item.id)}
              >
                <Icon className={`h-4 w-4 ${isOpen ? "mr-3" : ""}`} />
                {isOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 ${
                          isActive 
                            ? "bg-blue-500 text-blue-100" 
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-gray-700 hover:bg-gray-100 ${!isOpen ? "px-2" : ""}`}
            >
              <User className={`h-4 w-4 ${isOpen ? "mr-3" : ""}`} />
              {isOpen && <span>Profile</span>}
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-gray-700 hover:bg-gray-100 ${!isOpen ? "px-2" : ""}`}
            >
              <Settings className={`h-4 w-4 ${isOpen ? "mr-3" : ""}`} />
              {isOpen && <span>Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-gray-700 hover:bg-gray-100 ${!isOpen ? "px-2" : ""}`}
            >
              <LogOut className={`h-4 w-4 ${isOpen ? "mr-3" : ""}`} />
              {isOpen && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
