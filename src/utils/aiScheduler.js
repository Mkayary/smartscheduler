// Enhanced AI Scheduling Algorithm
export class AIScheduler {
  constructor(workingHours) {
    this.workingHours = workingHours
    this.breakDuration = 15 // 15 minute breaks between tasks
    this.lunchBreak = { duration: 60, preferredTime: '12:00' }
  }

  // Convert time string to minutes since midnight
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Convert minutes since midnight to time string
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Calculate task urgency score
  calculateUrgency(task, currentTime) {
    const priorityWeight = { high: 100, medium: 50, low: 25 }
    const baseScore = priorityWeight[task.priority] || 25

    if (!task.deadline) return baseScore

    const deadlineMinutes = this.timeToMinutes(task.deadline)
    const currentMinutes = this.timeToMinutes(currentTime)
    const timeUntilDeadline = deadlineMinutes - currentMinutes

    // Increase urgency as deadline approaches
    const urgencyMultiplier = Math.max(0.1, 1 - (timeUntilDeadline / 480)) // 8 hours = 480 minutes
    
    return baseScore * (1 + urgencyMultiplier)
  }

  // Calculate task efficiency score based on time of day
  calculateEfficiencyScore(task, startTime) {
    const startMinutes = this.timeToMinutes(startTime)
    const hour = Math.floor(startMinutes / 60)

    // Peak productivity hours (9-11 AM and 2-4 PM)
    const peakHours = [9, 10, 14, 15]
    const goodHours = [8, 11, 13, 16]
    
    let efficiencyScore = 1.0

    if (peakHours.includes(hour)) {
      efficiencyScore = 1.3
    } else if (goodHours.includes(hour)) {
      efficiencyScore = 1.1
    } else if (hour < 8 || hour > 17) {
      efficiencyScore = 0.7
    }

    // High priority tasks get bonus during peak hours
    if (task.priority === 'high' && peakHours.includes(hour)) {
      efficiencyScore *= 1.2
    }

    return efficiencyScore
  }

  // Check if task fits in available time slot
  canFitTask(task, startTime, endTime) {
    const startMinutes = this.timeToMinutes(startTime)
    const endMinutes = this.timeToMinutes(endTime)
    const availableTime = endMinutes - startMinutes

    return task.duration <= availableTime
  }

  // Find optimal time slot for a task
  findOptimalSlot(task, schedule, workStart, workEnd) {
    const workStartMinutes = this.timeToMinutes(workStart)
    const workEndMinutes = this.timeToMinutes(workEnd)
    
    let bestSlot = null
    let bestScore = -1

    // Try different time slots
    for (let startMinutes = workStartMinutes; startMinutes <= workEndMinutes - task.duration; startMinutes += 15) {
      const endMinutes = startMinutes + task.duration
      const startTime = this.minutesToTime(startMinutes)
      const endTime = this.minutesToTime(endMinutes)

      // Check for conflicts with existing schedule
      const hasConflict = schedule.some(scheduledTask => {
        const scheduledStart = this.timeToMinutes(scheduledTask.startTime)
        const scheduledEnd = this.timeToMinutes(scheduledTask.endTime)
        
        return (startMinutes < scheduledEnd && endMinutes > scheduledStart)
      })

      if (!hasConflict && endMinutes <= workEndMinutes) {
        const urgencyScore = this.calculateUrgency(task, startTime)
        const efficiencyScore = this.calculateEfficiencyScore(task, startTime)
        
        // Prefer times closer to preferred deadline
        let deadlineScore = 1.0
        if (task.deadline) {
          const deadlineMinutes = this.timeToMinutes(task.deadline)
          const timeDiff = Math.abs(startMinutes - deadlineMinutes)
          deadlineScore = Math.max(0.1, 1 - (timeDiff / 240)) // 4 hours tolerance
        }

        const totalScore = urgencyScore * efficiencyScore * deadlineScore

        if (totalScore > bestScore) {
          bestScore = totalScore
          bestSlot = { startTime, endTime, score: totalScore }
        }
      }
    }

    return bestSlot
  }

  // Main optimization algorithm
  optimizeSchedule(tasks) {
    if (!tasks || tasks.length === 0) return []

    const workStart = this.workingHours.start
    const workEnd = this.workingHours.end
    const schedule = []

    // Sort tasks by priority and urgency
    const sortedTasks = [...tasks].sort((a, b) => {
      const urgencyA = this.calculateUrgency(a, workStart)
      const urgencyB = this.calculateUrgency(b, workStart)
      return urgencyB - urgencyA
    })

    // Schedule each task
    for (const task of sortedTasks) {
      const optimalSlot = this.findOptimalSlot(task, schedule, workStart, workEnd)
      
      if (optimalSlot) {
        schedule.push({
          ...task,
          startTime: optimalSlot.startTime,
          endTime: optimalSlot.endTime,
          optimizationScore: optimalSlot.score
        })
      }
    }

    // Sort schedule by start time
    schedule.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime))

    // Add breaks between tasks
    return this.addBreaks(schedule)
  }

  // Add breaks between tasks
  addBreaks(schedule) {
    if (schedule.length <= 1) return schedule

    const scheduleWithBreaks = []
    
    for (let i = 0; i < schedule.length; i++) {
      scheduleWithBreaks.push(schedule[i])
      
      // Add break if there's a next task and gap is small
      if (i < schedule.length - 1) {
        const currentEnd = this.timeToMinutes(schedule[i].endTime)
        const nextStart = this.timeToMinutes(schedule[i + 1].startTime)
        const gap = nextStart - currentEnd
        
        if (gap > 0 && gap < this.breakDuration) {
          // Extend current task end time to include break
          const newEndTime = this.minutesToTime(currentEnd + this.breakDuration)
          scheduleWithBreaks[scheduleWithBreaks.length - 1].endTime = newEndTime
        }
      }
    }

    return scheduleWithBreaks
  }

  // Calculate schedule efficiency metrics
  calculateMetrics(schedule, tasks) {
    if (!schedule.length) return { efficiency: 0, coverage: 0, balance: 0 }

    const totalTaskTime = tasks.reduce((sum, task) => sum + task.duration, 0)
    const scheduledTime = schedule.reduce((sum, task) => sum + task.duration, 0)
    
    const coverage = scheduledTime / totalTaskTime
    
    // Calculate time distribution balance
    const hourlyDistribution = new Array(24).fill(0)
    schedule.forEach(task => {
      const startHour = Math.floor(this.timeToMinutes(task.startTime) / 60)
      const endHour = Math.floor(this.timeToMinutes(task.endTime) / 60)
      for (let hour = startHour; hour <= endHour; hour++) {
        hourlyDistribution[hour] += task.duration / (endHour - startHour + 1)
      }
    })
    
    const workingHours = this.timeToMinutes(this.workingHours.end) - this.timeToMinutes(this.workingHours.start)
    const averageLoad = scheduledTime / (workingHours / 60)
    const variance = hourlyDistribution.reduce((sum, load) => sum + Math.pow(load - averageLoad, 2), 0) / 24
    const balance = Math.max(0, 1 - (variance / (averageLoad * averageLoad)))
    
    // Overall efficiency score
    const efficiency = (coverage * 0.4 + balance * 0.3 + (schedule.length > 0 ? 0.3 : 0))
    
    return { efficiency, coverage, balance }
  }
}

