"use client";

import { useRouter } from "next/navigation";

export function ProfileForm({ user }: any) {
  const router = useRouter();

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Stops page refreshing

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      age: formData.get("age"),
      image: formData.get("image"),
    };

    const res = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await res.json();

    //Navigate to the user page using the id
    router.push(`/users/${user.id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8">
      <h2 className="text-2xl mb-6">Edit Your Profile</h2>
      <form onSubmit={updateUser} className="space-y-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={user?.name ?? ""}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded"
        />
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          name="bio"
          cols={30}
          rows={10}
          defaultValue={user?.bio ?? ""}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded resize-none"
        ></textarea>
        <label htmlFor="age" className="block text-sm font-medium">
          Age
        </label>
        <input
          type="text"
          name="age"
          defaultValue={user?.age ?? 0}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded"
        />
        <label htmlFor="image" className="block text-sm font-medium">
          Profile Image URL
        </label>
        <input
          type="text"
          name="image"
          defaultValue={user?.image ?? ""}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded"
        />

        <button
          type="submit"
          className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
