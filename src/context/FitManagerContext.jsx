import { createContext, useContext, useState, useEffect } from 'react';
import { calculateNewStreak, calculateXP, getInactivityStatus, PENALTY_XP } from '../utils/gamification';
import { calculateStudentStatus, calculateChurnRisk } from '../utils/businessLogic';
import { MOCK_STUDENTS } from '../data/mockStudents';

const FitManagerContext = createContext();

const MOCK_WORKOUTS = [];

export function FitManagerProvider({ children }) {
  // --- State Initialization (Lazy for localStorage) ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitmanager_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('fitmanager_students');
    let initialStudents = saved ? JSON.parse(saved) : MOCK_STUDENTS;
    
    // Apply dynamic logic on load to ensure statuses are up to date
    return initialStudents.map(s => ({
      ...s,
      status: calculateStudentStatus(s.lastWorkoutDate),
      risk: calculateChurnRisk(s.lastWorkoutDate)
    }));
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('fitmanager_workouts');
    return saved ? JSON.parse(saved) : MOCK_WORKOUTS;
  });

  // --- Dynamic Activity Feed ---
  const [recentActivities, setRecentActivities] = useState(() => {
    // Initial mock data to ensure the feed isn't empty on first load,
    // but these will be pushed down as new real activities come in.
    return [
      { id: 'mock-1', user: 'Carlos Silva', action: 'concluiu o treino', target: 'Hipertrofia A', time: new Date(Date.now() - 1000 * 60 * 2).toISOString(), type: 'workout' },
      { id: 'mock-2', user: 'Ana Souza', action: 'renovou o plano', target: 'Trimestral', time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'finance' },
      { id: 'mock-3', user: 'Pedro Santos', action: 'fez check-in', target: 'Musculação', time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'checkin' },
    ];
  });

  const logActivity = (user, action, target, type = 'general') => {
    const newActivity = {
      id: Date.now() + Math.random(),
      user,
      action,
      target,
      time: new Date().toISOString(),
      type
    };
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20
  };

  // --- Persistence Effects ---
  useEffect(() => {
    if (user) localStorage.setItem('fitmanager_user', JSON.stringify(user));
    else localStorage.removeItem('fitmanager_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fitmanager_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('fitmanager_workouts', JSON.stringify(workouts));
  }, [workouts]);

  // --- Migration: Randomize Phone Numbers (One-time) ---
  useEffect(() => {
    const hasMigrated = localStorage.getItem('fitmanager_phone_migration_v1');
    if (!hasMigrated && students.length > 0) {
      const updatedStudents = students.map(student => {
        // Generate random phone: (45) 9xxxx-xxxx
        const part1 = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
        const part2 = Math.floor(Math.random() * 9000) + 1000;   // 1000-9999
        return {
          ...student,
          phone: `(45) 9${part1.toString().substring(1)}-${part2}`
        };
      });
      
      setStudents(updatedStudents);
      localStorage.setItem('fitmanager_phone_migration_v1', 'true');
      console.log('Migration: Phone numbers randomized to DDD 45');
    }
  }, [students]);

  // --- Theme Management ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fitmanager_theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('fitmanager_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- User Management ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('fitmanager_users');
    if (saved) return JSON.parse(saved);
    
    // Default Admin User
    return [{
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@fitmanager.com',
      password: '123456', // In a real app, this would be hashed
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    }];
  });

  useEffect(() => {
    localStorage.setItem('fitmanager_users', JSON.stringify(users));
  }, [users]);

  // --- Actions ---
  const login = (email, password) => {
    // Find user
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const token = 'fake-jwt-token-' + Date.now();
      const userWithToken = { ...foundUser, token };
      // Don't store password in session
      delete userWithToken.password;
      
      setUser(userWithToken);
      return { success: true };
    }
    
    return { success: false, error: 'Email ou senha incorretos.' };
  };

  const register = (name, email, password) => {
    // Check duplication
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Este email já está cadastrado.' };
    }

    const newUser = {
      id: 'admin-' + Date.now(),
      name,
      email,
      password,
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    setUsers(prev => [...prev, newUser]);
    
    // Auto login
    const token = 'fake-jwt-token-' + Date.now();
    const userWithToken = { ...newUser, token };
    delete userWithToken.password;
    setUser(userWithToken);

    return { success: true };
  };

  const recoverPassword = (email) => {
    // Mock recovery
    const exists = users.some(u => u.email === email);
    if (exists) {
      return { success: true, message: 'Um link de recuperação foi enviado para seu email.' };
    }
    // Security best practice: don't reveal if email exists, but for simulation we can be vague or just always say sent
    return { success: true, message: 'Se o email existir, você receberá um link de recuperação.' };
  };

  const loginAsStudent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setUser({
        ...student,
        role: 'student',
        token: 'fake-student-token-' + Date.now()
      });
      return true;
    }
    return false;
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      
      // Also update in the users list for persistence if it's an admin/manager
      if (updatedUser.role === 'admin' || updatedUser.role === 'Gerente') {
        setUsers(prevUsers => prevUsers.map(u => 
          u.email === prev.email ? { ...u, ...updates } : u
        ));
      }
      
      // If user is a student, sync changes to students list
      if (updatedUser.role === 'student' || students.some(s => s.id === updatedUser.id)) {
        setStudents(prevStudents => 
          prevStudents.map(s => s.id === updatedUser.id ? { ...s, ...updates } : s)
        );
      }
      
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      status: 'active', // Default to active
      risk: 'low',      // Default to low risk
      points: 0,
      workouts: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`
    };
    setStudents(prev => [...prev, newStudent]);
    logActivity(studentData.name, 'se matriculou', studentData.plan, 'student'); // Log registration
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(student => 
      String(student.id) === String(id) ? { ...student, ...updatedData } : student
    ));
  };

  const completeWorkout = (studentId, workoutId) => {
    // Update student stats
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentStreak = s.streak || 0;
        const lastWorkoutDate = s.lastWorkoutDate;
        
        const newStreak = calculateNewStreak(lastWorkoutDate, currentStreak);
        const xpEarned = calculateXP(newStreak).total;
        const newLastWorkoutDate = new Date().toISOString();

        const updatedStudent = {
          ...s,
          points: (s.points || 0) + xpEarned,
          workouts: (s.workouts || 0) + 1,
          streak: newStreak,
          lastWorkoutDate: newLastWorkoutDate,
          status: calculateStudentStatus(newLastWorkoutDate),
          risk: calculateChurnRisk(newLastWorkoutDate)
        };
        
        // Sync with user if it's the same person
        if (user && user.id === studentId) {
          setUser(prevUser => ({ ...prevUser, ...updatedStudent }));
        }
        
        return updatedStudent;
      }
      return s;
    }));

    // Mark workout as completed
    if (workoutId) {
      setWorkouts(prev => prev.map(w => {
        if (w.id === workoutId) {
          return { ...w, completed: true, completedAt: new Date().toISOString() };
        }
        return w;
      }));
    }

    // Log Activity
    const student = students.find(s => s.id === studentId);
    const workout = workouts.find(w => w.id === workoutId);
    if (student && workout) {
      logActivity(student.name, 'concluiu o treino', workout.name, 'workout');
    }
  };

  const checkInactivity = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const { shouldPenalize } = getInactivityStatus(student.lastWorkoutDate);
    const lastPenaltyDate = student.lastPenaltyDate ? new Date(student.lastPenaltyDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already penalized today
    const alreadyPenalizedToday = lastPenaltyDate && 
      lastPenaltyDate.getDate() === today.getDate() &&
      lastPenaltyDate.getMonth() === today.getMonth() &&
      lastPenaltyDate.getFullYear() === today.getFullYear();

    if (shouldPenalize && !alreadyPenalizedToday) {
      const newPoints = Math.max(0, (student.points || 0) - PENALTY_XP);
      
      const updatedStudent = {
        ...student,
        points: newPoints,
        lastPenaltyDate: new Date().toISOString()
      };

      // Update Students List
      setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));

      // Update User if needed
      if (user && user.id === studentId) {
        setUser(prevUser => ({ ...prevUser, ...updatedStudent }));
      }

      return true;
    }

    return false;
  };

  const addWorkout = (workoutData) => {
    const newWorkout = {
      id: Date.now(),
      ...workoutData,
      dateCreated: new Date().toISOString()
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const getStudentWorkouts = (studentId) => {
    return workouts.filter(w => String(w.studentId) === String(studentId));
  };

  // --- Derived Data (Selectors) ---
  const activeStudentsCount = students.filter(s => s.status === 'active').length;
  
  const PLAN_PRICES = {
    'Mensal': 150.00,
    'Trimestral': 400.00,
    'Anual': 1200.00
  };

  const generateFinancials = () => {
    const activeStudents = students.filter(s => s.status === 'active');
    
    // Revenue (Sum of active plans)
    const revenue = activeStudents.reduce((acc, student) => {
      return acc + (PLAN_PRICES[student.plan] || 0);
    }, 0);

    // Expenses (Fixed Mock)
    const expenses = 4200.00;

    // Generate Transactions
    const transactions = [
      // Fixed Expenses
      { id: 'exp-1', student: 'Aluguel', type: 'Expense', amount: 2500.00, date: '2023-11-05', status: 'Paid' },
      { id: 'exp-2', student: 'Energia Elétrica', type: 'Expense', amount: 380.00, date: '2023-11-10', status: 'Paid' },
      { id: 'exp-3', student: 'Internet', type: 'Expense', amount: 120.00, date: '2023-11-10', status: 'Paid' },
      { id: 'exp-4', student: 'Limpeza', type: 'Expense', amount: 800.00, date: '2023-11-15', status: 'Paid' },
      
      // Income from Students
      ...activeStudents.map((student, index) => ({
        id: `inc-${student.id}`,
        student: student.name,
        type: 'Income',
        amount: PLAN_PRICES[student.plan] || 0,
        date: `2023-11-${25 - (index % 10)}`, // Spread dates
        status: 'Paid'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      transactions
    };
  };

  const financials = generateFinancials();

  const value = {
    user,
    students,
    workouts,
    login,
    register,
    recoverPassword,
    logout,
    loginAsStudent,
    updateUser,
    addStudent,
    updateStudent,
    deleteStudent,
    addWorkout,
    completeWorkout,
    getStudentWorkouts,
    checkInactivity,
    theme,
    toggleTheme,
    stats: {
      activeStudents: activeStudentsCount,
      financials // Expose financials
    },
    recentActivities // Expose activities
  };

  return (
    <FitManagerContext.Provider value={value}>
      {children}
    </FitManagerContext.Provider>
  );
}

export function useFitManager() {
  const context = useContext(FitManagerContext);
  if (!context) {
    throw new Error('useFitManager must be used within a FitManagerProvider');
  }
  return context;
}
