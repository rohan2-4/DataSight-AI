import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-6">
        Count: {count}
      </h2>

      <button
        onClick={increase}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Increase
      </button>
    </div>
  );
}

export default Counter;