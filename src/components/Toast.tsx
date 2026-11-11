interface ToastProps {
  message: string | null
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div
      key={message}
      className="animate-toast-in fixed bottom-6 left-1/2 z-[100] max-w-[90%] -translate-x-1/2 rounded-xl bg-stone-900 px-5 py-3 text-center text-white shadow-lg"
    >
      {message}
    </div>
  )
}
