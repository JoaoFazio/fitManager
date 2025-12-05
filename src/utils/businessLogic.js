export const STATUS_THRESHOLDS = {
  ACTIVE_DAYS: 14, // Considered active if workout within 14 days
  RISK_MEDIUM_DAYS: 7, // Medium risk if no workout for 7+ days
  RISK_HIGH_DAYS: 14 // High risk if no workout for 14+ days (same as inactive)
};

export const calculateStudentStatus = (lastWorkoutDate) => {
  if (!lastWorkoutDate) return 'inactive';

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffTime = Math.abs(now - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= STATUS_THRESHOLDS.ACTIVE_DAYS) {
    return 'active';
  }
  return 'inactive';
};

export const calculateChurnRisk = (lastWorkoutDate) => {
  if (!lastWorkoutDate) return 'high';

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffTime = Math.abs(now - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > STATUS_THRESHOLDS.RISK_HIGH_DAYS) {
    return 'high';
  }
  if (diffDays > STATUS_THRESHOLDS.RISK_MEDIUM_DAYS) {
    return 'medium';
  }
  return 'low';
};
