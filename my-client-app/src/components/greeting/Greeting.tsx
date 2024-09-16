"use client";
import { AuthProvider } from "@common/providers/auth.provider";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {};

const Greeting = (props: Props) => {
  const provider = new AuthProvider();
  const [greeting, setGreeting] = useState<string>();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {}, []);

  const handleLogin = async () => {
    if (!formData.identifier || !formData.password) return;
    const result = await provider.login({
      identifier: formData.identifier,
      password: formData.password,
    });

    setGreeting(result.name);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[lavender] p-6 block">
      Test the API here:
      {greeting ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Hello&nbsp;{greeting}</h1>
          <button
            className="bg-[white] rounded-full"
            onClick={() => setGreeting(undefined)}
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label>name</label>
          <input
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
          />
          <label>password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="bg-[white] rounded-full" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Greeting;
