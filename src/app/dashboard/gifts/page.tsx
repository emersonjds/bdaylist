"use client";

import { GiftManager } from "@/features/manage-gifts/gift-manager";

export default function GiftsPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
          Meus Presentes
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Adicione, edite e organize os itens da sua lista de desejos.
        </p>
      </header>

      <GiftManager />
    </>
  );
}
