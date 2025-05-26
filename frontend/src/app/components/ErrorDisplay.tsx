interface ErrorDisplayProps {
  error: string | null; 
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null; 

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-2xl mb-8">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
        <p className="font-medium">{error}</p>
      </div>
    </div>
  );
}