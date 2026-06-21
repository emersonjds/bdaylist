import { reserveGift } from "@/entities/reservation/api";

test("reserves an available gift", async () => {
  const r = await reserveGift("p2", {
    guestName: "Ana",
    message: "Parabéns!",
    idempotencyKey: "k1",
  });
  expect(r.reservation.giftId).toBe("p2");
});

test("identical replay is idempotent (no duplicate)", async () => {
  await reserveGift("p3", {
    guestName: "Bia",
    message: "x",
    idempotencyKey: "k2",
  });
  const again = await reserveGift("p3", {
    guestName: "Bia",
    message: "x",
    idempotencyKey: "k2",
  });
  expect(again.reservation.giftId).toBe("p3");
});

test("reservation by another person returns 409", async () => {
  await reserveGift("p4", {
    guestName: "Bia",
    message: "x",
    idempotencyKey: "k3",
  });
  await expect(
    reserveGift("p4", {
      guestName: "Ciro",
      message: "y",
      idempotencyKey: "k4",
    })
  ).rejects.toMatchObject({ status: 409 });
});
