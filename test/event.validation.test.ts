import request from "supertest";
import app from "../src/app";

describe("Event create validation (POST /api/v1/events)", () => {
  it("should create event when body is valid", async () => {
    const res = await request(app).post("/api/v1/events").send({
      name: "Small Event",
      date: "2025-12-25T09:00:00.000Z",
      capacity: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.registrationCount).toBe(0);
    expect(res.body.data.status).toBe("active");
    expect(res.body.data.category).toBe("general");
  });

  it("should fail when name is missing", async () => {
    const res = await request(app).post("/api/v1/events").send({
      date: "2025-12-25T09:00:00.000Z",
      capacity: 5,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail when date is not ISO", async () => {
    const res = await request(app).post("/api/v1/events").send({
      name: "Bad Date Event",
      date: "25-12-2025",
      capacity: 5,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail when capacity is 0", async () => {
    const res = await request(app).post("/api/v1/events").send({
      name: "Bad Capacity Event",
      date: "2025-12-25T09:00:00.000Z",
      capacity: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});