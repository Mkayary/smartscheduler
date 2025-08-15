import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Calendar, 
  Clock, 
  Plus, 
  Zap, 
  Smartphone, 
  Users,
  ExternalLink,
  Shield,
  HelpCircle,
  TrendingUp,
  Target,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { DraggableTask } from './components/DraggableTask'
import { AIScheduler } from './utils/aiScheduler'
import { StructuredData } from './components/StructuredData'
import { AdSensePlaceholder } from './components/AdSenseAd'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Morning workout', duration: 60, priority: 'high', deadline: '09:00' },
    { id: 2, name: 'Team meeting', duration: 90, priority: 'high', deadline: '10:30' },
    { id: 3, name: 'Project review', duration: 45, priority: 'medium', deadline: '14:00' },
    { id: 4, name: 'Email responses', duration: 30, priority: 'low', deadline: '16:00' }
  ])
  
  const [newTask, setNewTask] = useState({
    name: '',
    duration: '',
    priority: 'medium',
    deadline: ''
  })
  
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00'
  })
  
  const [optimizedSchedule, setOptimizedSchedule] = useState([])
  const [scheduleMetrics, setScheduleMetrics] = useState({ efficiency: 0, coverage: 0, balance: 0 })
  const [showFAQ, setShowFAQ] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Drag and drop sensors with touch support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // AI Scheduler instance
  const aiScheduler = new AIScheduler(workingHours)

  // AI Optimization Algorithm
  const optimizeSchedule = async () => {
    setIsOptimizing(true)
    
    // Simulate AI processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const optimized = aiScheduler.optimizeSchedule(tasks)
    const metrics = aiScheduler.calculateMetrics(optimized, tasks)
    
    setOptimizedSchedule(optimized)
    setScheduleMetrics(metrics)
    setIsOptimizing(false)
  }

  useEffect(() => {
    optimizeSchedule()
  }, [tasks, workingHours])

  const addTask = () => {
    if (newTask.name && newTask.duration) {
      setTasks([...tasks, {
        id: Date.now(),
        ...newTask,
        duration: parseInt(newTask.duration)
      }])
      setNewTask({ name: '', duration: '', priority: 'medium', deadline: '' })
    }
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (timeStr) => {
    return new Date(`2024-01-01 ${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* SEO Structured Data */}
      <StructuredData />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SmartScheduler
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setShowFAQ(!showFAQ)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Privacy
              </button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    setShowFAQ(!showFAQ)
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    setShowPrivacy(!showPrivacy)
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Privacy
                </button>
                <div className="px-4">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 hero-title">
            AI-Powered Daily
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Schedule Optimization
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your productivity with intelligent task scheduling. 
            Drag, drop, and let our AI optimize your daily workflow for maximum efficiency.
          </p>
          
          {/* Mobile-optimized feature highlights */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 mb-12">
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-700">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span className="text-sm sm:text-base">Real-time Optimization</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-700">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-sm sm:text-base">Smart Drag & Drop</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-700">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-sm sm:text-base">Calendar Sync</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-700">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <span className="text-sm sm:text-base">Mobile Friendly</span>
            </div>
          </div>

          {/* Top Banner Ad */}
          <div className="mb-8">
            <AdSensePlaceholder 
              width="728px" 
              height="90px" 
              className="mx-auto max-w-full"
              position="banner"
            />
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Task Input Panel */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Plus className="w-5 h-5" />
                  <span>Task Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Add New Task */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Add New Task</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="taskName">Task Name</Label>
                      <Input
                        id="taskName"
                        placeholder="Enter task name"
                        value={newTask.name}
                        onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                        className="text-base" // Better for mobile
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="60"
                        value={newTask.duration}
                        onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger className="text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="deadline">Preferred Time</Label>
                      <Input
                        id="deadline"
                        type="time"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                        className="text-base"
                      />
                    </div>
                  </div>
                  <Button onClick={addTask} className="w-full text-base py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Working Hours */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Working Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={workingHours.start}
                        onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={workingHours.end}
                        onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                        className="text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Draggable Task List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Your Tasks</h3>
                    <Badge variant="outline" className="text-xs">
                      Drag to reorder
                    </Badge>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <DraggableTask
                            key={task.id}
                            task={task}
                            onRemove={removeTask}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Add your first task to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Optimized Schedule Display */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>AI-Optimized Schedule</span>
                  </div>
                  {isOptimizing && (
                    <div className="flex items-center space-x-2 text-sm text-indigo-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span className="hidden sm:inline">Optimizing...</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Schedule Metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                        {Math.round(scheduleMetrics.efficiency * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {Math.round(scheduleMetrics.coverage * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-cyan-600">
                        {Math.round(scheduleMetrics.balance * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Balance</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-700">
                      Optimized for {formatTime(workingHours.start)} - {formatTime(workingHours.end)}
                    </span>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sync to Google Calendar</span>
                      <span className="sm:hidden">Sync Calendar</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {optimizedSchedule.map((task, index) => (
                      <div key={task.id} className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm schedule-item">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-gray-900 text-sm sm:text-base pr-2">{task.name}</span>
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                              {task.priority}
                            </Badge>
                            {task.optimizationScore && (
                              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {Math.round(task.optimizationScore)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(task.startTime)} - {formatTime(task.endTime)}
                          </span>
                          <span>({task.duration} minutes)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (task.duration / 120) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {optimizedSchedule.length === 0 && !isOptimizing && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Add tasks to see your optimized schedule</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Ad for larger screens */}
          <div className="hidden xl:block fixed right-4 top-1/2 transform -translate-y-1/2">
            <AdSensePlaceholder 
              width="160px" 
              height="600px" 
              position="sidebar"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Maximum Productivity
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              SmartScheduler combines AI intelligence with intuitive design to revolutionize how you manage your time.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 feature-grid">
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Optimization</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Advanced algorithms analyze your tasks, priorities, and deadlines to create the most efficient schedule possible.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Smart Drag & Drop</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Intuitive drag-and-drop interface with real-time AI re-optimization as you reorder tasks.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Instant schedule adjustments with efficiency metrics as you add, remove, or modify tasks.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Calendar Sync</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Seamless integration with Google Calendar to keep all your appointments and tasks in sync.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Fully responsive design works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Track efficiency, coverage, and balance metrics to continuously improve your productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Links Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Boost Your Productivity Even Further
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Complement SmartScheduler with these powerful productivity tools used by millions of professionals worldwide.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg sm:text-xl">N</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Notion</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  All-in-one workspace for notes, docs, and project management. Perfect for organizing your thoughts and plans.
                </p>
                <Button variant="outline" className="w-full group">
                  Try Notion Free
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg sm:text-xl">T</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Todoist</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Professional task management with natural language processing and advanced project organization.
                </p>
                <Button variant="outline" className="w-full group">
                  Start Free Trial
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Calendly</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Seamless meeting scheduling that eliminates back-and-forth emails and integrates with your calendar.
                </p>
                <Button variant="outline" className="w-full group">
                  Get Calendly
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Banner Ad */}
          <div className="mt-12 text-center">
            <AdSensePlaceholder 
              width="728px" 
              height="90px" 
              className="mx-auto max-w-full"
              position="banner"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {showFAQ && (
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Everything you need to know about SmartScheduler
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                    How does the AI optimization work?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Our AI algorithm considers multiple factors including task priority, deadlines, duration, time-of-day efficiency, and your working hours. It uses advanced scoring and optimization techniques to minimize conflicts and maximize productivity while respecting your preferences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                    How does drag-and-drop reordering work?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Simply drag tasks up or down in the task list to reorder them. The AI will automatically re-optimize your schedule based on the new order while maintaining efficiency. Your manual preferences are respected and incorporated into the optimization algorithm.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                    What do the efficiency metrics mean?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Efficiency measures overall schedule optimization, Coverage shows what percentage of your tasks fit in your working hours, and Balance indicates how evenly distributed your workload is throughout the day. Higher percentages indicate better optimization.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                    Is my data secure?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Yes, all your data is processed locally in your browser and is not stored on our servers. Your tasks and schedule information remain completely private and secure. No account creation or personal information is required.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Privacy Policy</span>
                <Button variant="ghost" size="sm" onClick={() => setShowPrivacy(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
                <p className="text-gray-600 text-sm">
                  SmartScheduler does not collect, store, or transmit any personal data. All task information and schedules are processed locally in your browser and are not sent to our servers.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies and Analytics</h3>
                <p className="text-gray-600 text-sm">
                  We use Google Analytics to understand how users interact with our website. This helps us improve the user experience. No personally identifiable information is collected.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Third-Party Services</h3>
                <p className="text-gray-600 text-sm">
                  Our website may contain affiliate links to third-party productivity tools. We may receive a commission if you make a purchase through these links, at no additional cost to you.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-gray-600 text-sm">
                  If you have any questions about this privacy policy, please contact us at privacy@smartscheduler.app
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">SmartScheduler</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered daily schedule optimization for maximum productivity.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Optimization</li>
                <li>Smart Drag & Drop</li>
                <li>Real-time Updates</li>
                <li>Performance Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowFAQ(true)}>FAQ</button></li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Feature Requests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowPrivacy(true)}>Privacy Policy</button></li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6 sm:my-8 bg-gray-800" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2024 SmartScheduler. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Banner Ad */}
          <div className="mt-8 text-center">
            <AdSensePlaceholder 
              width="728px" 
              height="90px" 
              className="mx-auto max-w-full"
              position="footer"
            />
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Ad */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 p-2 z-40">
        <AdSensePlaceholder 
          width="100%" 
          height="50px" 
          position="banner"
        />
      </div>

      {/* Desktop Floating Ad */}
      <div className="hidden sm:block fixed bottom-4 right-4 z-40">
        <AdSensePlaceholder 
          width="300px" 
          height="250px" 
          position="sidebar"
        />
      </div>
    </div>
  )
}

export default App

