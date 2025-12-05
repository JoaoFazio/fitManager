export const WORKOUT_TEMPLATES = [
  {
    id: 'full-body-a',
    name: 'Full Body - Adaptação',
    exercises: [
      { exerciseId: '4', sets: 3, reps: '12', weight: '0' }, // Agachamento
      { exerciseId: '1', sets: 3, reps: '12', weight: '10' }, // Supino Reto
      { exerciseId: '8', sets: 3, reps: '12', weight: '25' }, // Puxada Alta
      { exerciseId: '13', sets: 3, reps: '12', weight: '8' }, // Desenvolvimento
      { exerciseId: '10', sets: 3, reps: '12', weight: '5' }, // Rosca Direta
      { exerciseId: '11', sets: 3, reps: '12', weight: '15' }, // Tríceps Pulley
      { exerciseId: '15', sets: 3, reps: '30s', weight: '0' } // Prancha
    ]
  },
  {
    id: 'upper-push',
    name: 'Treino A: Superiores',
    exercises: [
      { exerciseId: '1', sets: 4, reps: '10', weight: '20' }, // Supino Reto
      { exerciseId: '2', sets: 3, reps: '12', weight: '15' }, // Supino Inclinado
      { exerciseId: '13', sets: 3, reps: '12', weight: '12' }, // Desenvolvimento
      { exerciseId: '12', sets: 3, reps: '15', weight: '8' }, // Elevação Lateral
      { exerciseId: '11', sets: 4, reps: '12', weight: '20' } // Tríceps Pulley
    ]
  },
  {
    id: 'lower-pull',
    name: 'Treino B: Inferiores e Costas',
    exercises: [
      { exerciseId: '4', sets: 4, reps: '10', weight: '30' }, // Agachamento
      { exerciseId: '5', sets: 3, reps: '12', weight: '80' }, // Leg Press
      { exerciseId: '6', sets: 3, reps: '15', weight: '30' }, // Extensora
      { exerciseId: '8', sets: 4, reps: '12', weight: '40' }, // Puxada Alta
      { exerciseId: '9', sets: 3, reps: '12', weight: '30' }, // Remada Curvada
      { exerciseId: '10', sets: 3, reps: '12', weight: '10' } // Rosca Direta
    ]
  },
  {
    id: 'glutes-focus',
    name: 'Foco em Glúteos',
    exercises: [
      { exerciseId: '4', sets: 4, reps: '12', weight: '40' }, // Agachamento
      { exerciseId: '5', sets: 3, reps: '15', weight: '100' }, // Leg Press
      { exerciseId: '6', sets: 3, reps: '15', weight: '30' }, // Extensora
      { exerciseId: '7', sets: 4, reps: '12', weight: '30' }, // Flexora
      { exerciseId: '14', sets: 3, reps: '20', weight: '0' } // Abdominal
    ]
  },
  {
    id: 'cardio-metabolic',
    name: 'Cardio & Metabólico',
    exercises: [
      { exerciseId: '4', sets: 4, reps: '20', weight: '0' }, // Agachamento (Peso do corpo)
      { exerciseId: '15', sets: 3, reps: '45s', weight: '0' }, // Prancha
      { exerciseId: '14', sets: 4, reps: '20', weight: '0' }, // Abdominal
      { exerciseId: '12', sets: 3, reps: '15', weight: '4' }, // Elevação Lateral (Leve)
      { exerciseId: '10', sets: 3, reps: '15', weight: '5' } // Rosca Direta (Leve)
    ]
  }
];
