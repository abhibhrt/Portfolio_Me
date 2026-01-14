'use client';

import { useEffect, useState } from 'react';

export default function TESTAPI() {
  const [name, setName] = useState('');

  useEffect(() => {
    const testApi = async () => {
      try {
        const res = await fetch('/api/test', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          console.warn('API test failed:', res.status);
          return;
        }

        const data = await res.json();
        console.log('API test successful:', data);
      } catch (error) {
        console.error('API test error:', error);
      }
    };

    testApi();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log('✅ FORM SUBMITTED');

    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      console.log('POST status:', res.status);

      const result = await res.json();
      console.log('POST RESPONSE:', result);

      setName('');
    } catch (error) {
      console.error('POST error:', error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded bg-gray-900 p-6"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded p-2 text-black"
      />

      <button
        type="submit"
        className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
