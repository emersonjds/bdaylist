import { criarReserva } from "@/entities/reserva/api";

test("reserva um presente disponível", async () => {
  const r = await criarReserva("p2", {
    convidadoNome: "Ana",
    recado: "Parabéns!",
    idempotencyKey: "k1",
  });
  expect(r.reserva.presenteId).toBe("p2");
});

test("replay idêntico é idempotente (não duplica)", async () => {
  await criarReserva("p3", {
    convidadoNome: "Bia",
    recado: "x",
    idempotencyKey: "k2",
  });
  const again = await criarReserva("p3", {
    convidadoNome: "Bia",
    recado: "x",
    idempotencyKey: "k2",
  });
  expect(again.reserva.presenteId).toBe("p3");
});

test("reserva por outra pessoa retorna 409", async () => {
  await criarReserva("p4", {
    convidadoNome: "Bia",
    recado: "x",
    idempotencyKey: "k3",
  });
  await expect(
    criarReserva("p4", {
      convidadoNome: "Ciro",
      recado: "y",
      idempotencyKey: "k4",
    }),
  ).rejects.toMatchObject({ status: 409 });
});

