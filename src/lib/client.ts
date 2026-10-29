"use client";

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Server xatosi (${res.status})`);
  }
  return res.json();
}

/** Rasmni kvadrat qilib kesib, 400px gacha kichraytiradi (localStorage uchun) */
export function resizeImage(file: File, size = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Rasmni o'qib bo'lmadi"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Rasm formati noto'g'ri"));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
