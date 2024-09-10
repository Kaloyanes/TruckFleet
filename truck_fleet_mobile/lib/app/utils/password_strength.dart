enum PasswordStrength {
  weak,
  medium,
  strong,
  veryStrong,
}

PasswordStrength checkPasswordStrength(String password) {
  int score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (RegExp(r'[A-Z]').hasMatch(password)) score++;
  if (RegExp(r'[a-z]').hasMatch(password)) score++;
  if (RegExp(r'[0-9]').hasMatch(password)) score++;
  if (RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) score++;

  if (score < 3) return PasswordStrength.weak;
  if (score < 4) return PasswordStrength.medium;
  if (score < 6) return PasswordStrength.strong;
  return PasswordStrength.veryStrong;
}
