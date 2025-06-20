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

export const showQuizFeedback = (isCorrect: boolean) => {
  return Swal.fire({
    title: isCorrect ? 'Correct!' : 'Try Again',
    text: isCorrect ? 'Great job! You got it right.' : 'That\'s not quite right. Try again!',
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

export const showQuickActions = () => {
  return Swal.fire({
    title: 'Quick Actions',
    html: `
      <div class="grid grid-cols-2 gap-4 mt-4">
        <button class="p-4 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors" data-action="lesson">
          <i class="fas fa-book text-blue-600 text-xl mb-2 block"></i>
          <span class="text-sm">Start Lesson</span>
        </button>
        <button class="p-4 bg-red-100 rounded-xl hover:bg-red-200 transition-colors" data-action="practice">
          <i class="fas fa-microphone text-red-600 text-xl mb-2 block"></i>
          <span class="text-sm">Practice Speaking</span>
        </button>
        <button class="p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors" data-action="quiz">
          <i class="fas fa-brain text-yellow-600 text-xl mb-2 block"></i>
          <span class="text-sm">Quick Quiz</span>
        </button>
        <button class="p-4 bg-green-100 rounded-xl hover:bg-green-200 transition-colors" data-action="progress">
          <i class="fas fa-chart-line text-green-600 text-xl mb-2 block"></i>
          <span class="text-sm">View Progress</span>
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    background: 'rgba(255, 255, 255, 0.95)',
    customClass: {
      popup: 'rounded-2xl'
    }
  });
};
