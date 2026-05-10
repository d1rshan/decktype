export const USERNAME_CHANGE_COOLDOWN_DAYS = 7;

export const getUsernameChangeDaysRemaining = (nextAvailableAt: Date) => {
  const msRemaining = nextAvailableAt.getTime() - Date.now();

  if (msRemaining <= 0) {
    return 0;
  }

  return Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
};

export const formatUsernameChangeTooltip = (nextAvailableAt: Date) => {
  const daysRemaining = getUsernameChangeDaysRemaining(nextAvailableAt);
  return `wait ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
};

export const getNextUsernameChangeAvailableAt = (
  usernameLastChangedAt?: Date,
) => {
  if (!usernameLastChangedAt) {
    return null;
  }

  const nextAvailableAt = new Date(usernameLastChangedAt);
  nextAvailableAt.setDate(
    nextAvailableAt.getDate() + USERNAME_CHANGE_COOLDOWN_DAYS,
  );

  return nextAvailableAt;
};
