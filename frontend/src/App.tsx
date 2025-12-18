import { useQuery } from '@tanstack/react-query'
import { useCounterStore } from './stores/useCounterStore'

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  const { data, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { message: 'Hello from React Query!' }
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            React + TypeScript + Vite
          </h1>
          <p className="text-gray-600">
            with Tailwind, Zustand & React Query
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Zustand Counter
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={decrement}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              -
            </button>
            <span className="text-4xl font-bold text-indigo-600">{count}</span>
            <button
              onClick={increment}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
            >
              +
            </button>
          </div>
          <button
            onClick={reset}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Reset
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            React Query
          </h2>
          <div className="bg-indigo-50 p-4 rounded">
            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <p className="text-indigo-700 font-medium">{data?.message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
