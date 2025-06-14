export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: string;
  backgroundColor: string;
  accentColor: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
