import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
    background: 'rgba(255, 255, 255, 0.95)',
    backdrop: 'rgba(0, 0, 0, 0.1)'
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
    background: 'rgba(255, 255, 255, 0.95)'
  });
};

export const showInfoAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    timer: 2000,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
    background: 'rgba(37, 99, 235, 0.95)',
    color: 'white'
  });
};

export const showQuizFeedback = (isCorrect: boolean, customMessage?: string) => {
  return Swal.fire({
    title: isCorrect ? 'Correct!' : 'Try Again',
    text: customMessage || (isCorrect ? 'Great job! You got it right.' : 'That\'s not quite right. Try again!'),
    icon: isCorrect ? 'success' : 'error',
    timer: 2000,
    showConfirmButton: false,
    position: 'center',
    background: 'rgba(255, 255, 255, 0.95)'
  });
};

export const showConfirmAlert = (title: string, text: string, confirmText = 'Yes, do it!') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    confirmButtonText: confirmText,
    background: 'rgba(255, 255, 255, 0.95)'
  });
};

export const showLessonCompleteAlert = (lessonTitle: string, nextLessonTitle?: string) => {
  return Swal.fire({
    title: 'Lesson Complete! 🎉',
    text: `Great job completing "${lessonTitle}"!${nextLessonTitle ? ` Next up: "${nextLessonTitle}"` : ''}`,
    icon: 'success',
    confirmButtonText: 'Continue Learning',
    confirmButtonColor: '#1e40af',
    background: 'rgba(255, 255, 255, 0.95)',
    customClass: {
      popup: 'rounded-2xl'
    }
  });
};

export const showProgressAlert = (progress: number, dialectName: string) => {
  return Swal.fire({
    title: `${dialectName} Progress`,
    text: `You're ${Math.round(progress)}% through this dialect!`,
    icon: 'info',
    timer: 2000,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
    background: 'rgba(34, 197, 94, 0.95)',
    color: 'white'
  });
};
