const API_URL = "http://localhost:8000/api";

export type StoreSettings = {
  id: string;
  autoOrderProgression: boolean;
};

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong",
    );
  }

  return data.data;
}

export async function getStoreSettings() {
  const response = await fetch(
    `${API_URL}/admin/settings`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return handleResponse<StoreSettings>(response);
}

export async function updateAutoOrderProgression(
  enabled: boolean,
) {
  const response = await fetch(
    `${API_URL}/admin/settings/auto-progression`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ enabled }),
    },
  );

  return handleResponse<StoreSettings>(response);
}