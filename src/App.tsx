import { useState, useEffect } from "react";
import { useUpdateUser, useUser } from "./api";

type FormData = {
  name: string;
  email: string;
  phone: string;
};

function App({ id }: { id: string }) {
  const userQuery = useUser(id);
  const updateUserMutation = useUpdateUser();

  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (userQuery.data) {
      setFormData(userQuery.data);
    }
  }, [userQuery.data]);

  useEffect(() => {
    setIsDirty(
      Object.entries(formData).some(
        ([key, value]) => userQuery.data?.[key as never] !== value
      )
    );
  }, [formData, userQuery.data]);

  const reset = () => {
    setFormData(
      userQuery.data ?? {
        name: "",
        email: "",
        phone: "",
      }
    );
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateUserMutation.mutateAsync({
      id,
      ...formData,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        className="mb-8 bg-white rounded-lg shadow-md p-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((l) => ({ ...l, name: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((l) => ({ ...l, email: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((l) => ({ ...l, phone: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={updateUserMutation.isPending || userQuery.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-sm shadow-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          Update User
        </button>
        <button
          type="button"
          disabled={!isDirty || userQuery.isPending}
          onClick={() => reset()}
          className="w-full bg-red-500 mt-2 text-white py-2 px-4 rounded-lg shadow-sm shadow-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default App;
